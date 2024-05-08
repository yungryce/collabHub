import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to the login page
        authService.logoutUser();
      }
      return throwError(() => new Error('Unauthorized Exception'));
    })
  );
};

export const headerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ContentType: 'application/json'
      }
    });
  }
  return next(req);
}