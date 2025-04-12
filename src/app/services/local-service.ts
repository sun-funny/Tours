import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {
  private usersFilePath = 'assets/users.json';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<{users: IUser[]}> {
    return this.http.get<{users: IUser[]}>(this.usersFilePath);
  }

  updateUsers(users: IUser[]): Observable<any> {
    localStorage.setItem('users', JSON.stringify({users}));
    return new Observable(observer => {
      observer.next({success: true});
      observer.complete();
    });
  }
}