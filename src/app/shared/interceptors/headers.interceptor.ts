import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('api.cloudinary.com')) {
    const authServ = inject(AuthService);
    const token = authServ.getToken();

    if (token != null) {
      let clone = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + token,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      return next(clone);
    }
    return next(req);
  }
  return next(req);
};
