import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('api.cloudinary.com')) {
    const router = inject(Router);
    const authServ = inject(AuthService);
    const token = authServ.getToken();

    if (token != null) {
      const tokenExpirationDate: number = jwtDecode(token!).exp! * 1000;

      if (Date.now() >= tokenExpirationDate) {
        authServ.removeToken();
        router.navigate(['']);
        alert("Votre session à expiré")
      } else {
        let clone = req.clone({
          setHeaders: {
            authorization: 'Bearer ' + token,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        return next(clone);
      }
    }
    return next(req);
  }
  return next(req);
};
