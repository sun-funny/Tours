import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../../models/user';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-authtorization',
  imports: [NgClass, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './authtorization.component.html',
  styleUrl: './authtorization.component.scss',
})
export class AuthtorizationComponent implements OnInit, OnDestroy{ 
  login: string;
  password: string;
  constructor(private userService: UserService,
      private router: Router,
      private messageService: MessageService
  ) {  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    const user: IUser = {
      login: this.login, 
      password: this.password
    }
    this.userService.authUser(user).subscribe({
      next: () => {
        this.userService.setUser(user);
        this.router.navigate(['tours']);},
      error: () => {this.initToast('error', 'Неверный логин или пароль');}
    })

  }

  initToast(type: 'error', text: string): void {
    this.messageService.add({ severity: type, detail: text, life: 3000})
  }
}