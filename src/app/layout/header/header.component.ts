import { AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IUser } from '../../models/user';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { BasketService } from '../../services/basket.service';
import { Observable } from 'rxjs';
import { ITour } from '../../models/tours';
import { DialogModule } from 'primeng/dialog';
import { BasketComponent } from '../../pages/basket/basket.component'

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    DatePipe, 
    MenubarModule, 
    ButtonModule,
    OverlayBadgeModule,
    AsyncPipe,
    DialogModule,
    BasketComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  dateTime: Date;
  menuItems: MenuItem[] = [];
  user: IUser;
  logoutIcon = 'pi pi-user'
  basketStore$: Observable<ITour[]> = null;
  displayBasketDialog = false; // флаг для отображения диалога

  constructor(
    private userService: UserService, 
    private router: Router, 
    private NgZone: NgZone,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.basketStore$ = this.basketService.basketStore$;
    this.user = this.userService.getUser();
    this.menuItems = this.initMenuItems();

    this.NgZone.runOutsideAngular(() => {
      setInterval(() => {
        this.dateTime = new Date();
      }, 1000);
    });
  }

  showBasketDialog(): void {
    this.displayBasketDialog = true;
  }

  ngOnDestroy() {}

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink: ['/tours'],
      },
      {
        label: 'Настройки',
        routerLink: ['/settings'],
      },
      {
        label: 'Заказы',
        routerLink: ['/orders'],
      },
    ];
  }

  logOut(): void {
    this.userService.setUser(null);
    this.router.navigate(['/auth']);
  }

  hoverLogoutBtn(val: boolean): void {
    this.logoutIcon = val ? 'pi pi-sign-out' : 'pi pi-user'
  }

  getLogin() {
    return this.user?.login;
  }
}
