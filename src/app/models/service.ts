import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private usersPath = '../../../server-data/users.json';

  constructor(private http: HttpClient) {}

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.get<any[]>(this.usersPath).pipe(
      switchMap(users => {
        // Находим текущего пользователя
        const currentUser = users.find(u => u.password === currentPassword);
        
        if (!currentUser) {
          throw new Error('Текущий пароль неверен');
        }

        // Обновляем пароль
        currentUser.password = newPassword;

        // Сохраняем обновленный список пользователей
        return this.saveUsers(users);
      }),
      catchError(error => {
        throw new Error('Ошибка при изменении пароля: ' + error.message);
      })
    );
  }

  private saveUsers(users: any[]): Observable<any> {   
    try {
      localStorage.setItem('users', JSON.stringify(users));
      return of({ success: true });
    } catch (error) {
      throw new Error('Ошибка при сохранении пользователей');
    }
  }
}