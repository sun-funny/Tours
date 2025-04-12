import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUserRegister } from '../../../models/user';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-registration',
  imports: [NgClass, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})

export class RegistrationComponent implements OnInit { 
  login: string = null;
  password: string;
  repeatPassword: string;
  cardNumber: string;
  email: string;
  isRemember: boolean;
  labelText = 'Сохранить пользователя в хранилище';
  constructor(private userService: UserService,
    private messageService: MessageService) {}

  ngOnInit(): void {

  }

  onAuth(): void{
    const postObj = {login: this.login, password: this.password, email: this.email} as IUserRegister;
    this.userService.registerUser(postObj).subscribe({
      next: () => { this.initToast('success', 'Регистрация успешна');},
      error: () => {this.initToast('error', 'Ошибка регистрации');}
    })
  }

  initToast(type: 'error' | 'success', text: string): void {
    this.messageService.add({ severity: type, detail: text, life: 3000})
  }
}