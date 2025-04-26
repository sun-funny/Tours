import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { filter, map, Subscription, take, tap } from 'rxjs';
import { routes } from '../app.routes';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { LoadedService } from '../services/loader.service';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule, 
    FooterComponent, 
    HeaderComponent, 
    AsideComponent,
    LoaderComponent,
    AsyncPipe
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
  showAside = false;
  subscription: Subscription;
  loader$ = inject(LoadedService).loader$

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
      this.showAside = this.recursFindChildData(this.activateRoute.snapshot, 'showAside');
      
      this.subscription = this.router.events.pipe(
        filter((routes) => routes instanceof ActivationEnd),
        map((data) => data.snapshot)
      ).subscribe((data) => {
        this.showAside = this.recursFindChildData(data, 'showAside');
        this.cdRef.detectChanges();
      });
    }

  recursFindChildData(children: ActivatedRouteSnapshot, prop: string): boolean {
    console.log('children', children)
    if (!children.data[prop] && children.firstChild) {
      return this.recursFindChildData(children.firstChild, prop);
    } else {
      return !!children.data[prop];
    }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
