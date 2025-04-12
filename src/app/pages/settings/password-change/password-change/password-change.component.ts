import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { MessageService } from 'primeng/api';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IUser } from '../../../../models/user';
import { Router } from '@angular/router';
import { LocalDataService } from '../../../../services/local-service';

@Component({
  selector: 'app-password-change',
  imports: [NgClass, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent {
    currentpassword: string;
    newpassword: string;
    repeatPassword: string;
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
  
    constructor(
      private userService: UserService,
      private localDataService: LocalDataService,
      private router: Router,
      private messageService: MessageService
    ) { }
  
  ngOnInit(): void {
    // Текущий пользователь
    const currentUser = this.userService.getUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
    }
  }

  async onChange(): Promise<void> {
    // Новый пароль и подтверждение не совпадают
    if (this.newpassword !== this.repeatPassword) {
      this.initToast('error', 'Новый пароль и подтверждение не совпадают');
      return;
    }

    // Текущий пользователь
    const currentUser = this.userService.getUser();
    if (!currentUser) {
      this.initToast('error', 'Пользователь не авторизован');
      return;
    }

    try {
      // Получить всех пользователей
      const data = await this.localDataService.getUsers().toPromise();
      const users = data?.users || [];

      // Найти текущего пользователя
      const userIndex = users.findIndex(u => u.login === currentUser.login);
      if (userIndex === -1) {
        this.initToast('error', 'Пользователь не найден');
        return;
      }

      // Проверить текущий пароль
      if (users[userIndex].password !== this.currentpassword) {
        this.initToast('error', 'Неверный текущий пароль');
        return;
      }

      // Обновить пароль
      users[userIndex].password = this.newpassword;

      // "Сохранить" изменения (в localStorage)
      await this.localDataService.updateUsers(users).toPromise();

      // Обновить текущего пользователя в сервисе
      this.userService.setUser({...currentUser, password: this.newpassword});

      this.initToast('success', 'Пароль успешно изменен');
      this.router.navigate(['/profile']);
    } catch (error) {
      this.initToast('error', 'Ошибка при изменении пароля');
      console.error(error);
    }
  }

  initToast(type: 'error' | 'success', text: string): void {
    this.messageService.add({ severity: type, detail: text, life: 3000});
  }
}
