import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('ACCESS_TOKEN');

  if (token) {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp ? new Date(decodedToken.exp * 1000) : null;
    const isExpired = expirationTime ? expirationTime < new Date() : false;

    console.log('Token expiration time:', expirationTime);

    if (isExpired) {
      console.log('Token expired');
      router.navigate(['/tokenExpired']);
    } else {
      console.log('Token not expired');
    }
  }

  return next(req);
};


