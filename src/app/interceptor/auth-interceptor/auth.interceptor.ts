import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Exclude requests that shouldn't have the Authorization header
  if (req.headers.has('Skip-Interceptor')) {
    const headers = req.headers.delete('Skip-Interceptor');
    return next(req.clone({ headers }));
  }

  // Retrieve the token from localStorage
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // const httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     // Add Authorization header if needed
  //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //   })
  // };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized errors by redirecting to login
        authService.logOut();
      }
      return throwError(() => new Error(error.message));
    })
  );
  
};
