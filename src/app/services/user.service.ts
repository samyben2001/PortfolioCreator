import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { User, UserLogin, UserRegister } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.url

  client = inject(HttpClient)

  register(user: UserRegister): Observable<User> {
    return this.client.post<User>(this.url + 'User/register', user)
  }

  login(user: UserLogin): Observable<string> {
    return this.client.post<string>(this.url + 'User/login', user)
  }
}
