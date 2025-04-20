import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './layout/layout.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourItemComponent } from './pages/tour-item/tour-item.component'
import { authGuard } from './shared/guards/auth.guard';
import { SettingsComponent } from './pages/settings/settings/settings.component';
import { PasswordChangeComponent } from './pages/settings/password-change/password-change/password-change.component';
import { StatisticsComponent } from './pages/settings/statistics/statistics/statistics.component';

export const routes: Routes = [
    {path: 'auth', component: AuthComponent},
    {path: '',   redirectTo: '/auth', pathMatch: 'full' },
    {path: 'tours', 
        canActivate: [authGuard],
        component: LayoutComponent,
        children: [
            { path: '', component: ToursComponent, data: {showAside: true}},
            { path: 'tour/:id', component: TourItemComponent},
            { path: 'tour', redirectTo: '', pathMatch: 'full'},
        ]
     },

     { path: 'settings',
      canActivate: [authGuard],
      component: SettingsComponent,
      children: [
        { path: '', redirectTo: 'change-password', pathMatch: 'full',},
        { path: 'change-password', component: PasswordChangeComponent},
        { path: 'statistics', component: StatisticsComponent, data: {showAside: true}}
      ]

    },

    {path: '**', redirectTo: '/auth', pathMatch: 'full'  },  
];
