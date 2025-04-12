import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthtorizationComponent } from './authtorization/authtorization.component';
import { RegistrationComponent } from './registration/registration.component';
import { TabsModule } from 'primeng/tabs';
import { Toast } from 'primeng/toast';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  imports: [AuthtorizationComponent, RegistrationComponent, TabsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy{

  ngOnInit(): void {
    console.log('init')
  }
  ngOnDestroy(): void {
    console.log('destr')
  }

}
