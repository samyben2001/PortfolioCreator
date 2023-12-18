import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isConnected = signal<boolean>(false);

  checkConnection() {
    if (this.getToken()) this.isConnected.set(true);
    else this.isConnected.set(false);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);

    const decodeToken: any = jwtDecode(token);
    let u: any = {
      Id: decodeToken.UserId,
      Email: decodeToken.Email,
      Username: decodeToken.Username,
      CreationDate: decodeToken.CreationDate,
    };

    localStorage.setItem('User', JSON.stringify(u));

    this.isConnected.set(true);
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('User');
    this.isConnected.set(false);
  }

  getToken(): string | null {
    let token = localStorage.getItem('token');

    if (token) {
      this.isConnected.set(true);
    }

    return token != null ? token : null;
  }

  getUser() {
    const u = localStorage.getItem('User')
    return u != null? JSON.parse(u) : null;
  }
}
