import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { filter, map, Subscription, take, tap } from 'rxjs';
import { routes } from '../app.routes';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, FooterComponent, HeaderComponent, AsideComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
  showAside = false;
  subscription: Subscription;
  constructor(private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.showAside = this.recursFindChildData(this.activateRoute.snapshot, 'showAside')

    this.subscription = this.router.events.pipe(
      filter((routes) => routes instanceof ActivationEnd),
      map((data) => data.snapshot)
    ).subscribe((data) => {
      this.showAside = this.recursFindChildData(data, 'showAside')
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
