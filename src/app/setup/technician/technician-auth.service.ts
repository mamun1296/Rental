import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { TechnicianService } from './technician.service';
import { NotifyService } from '../../services/notify-services/notify.service';
@Injectable({
  providedIn: 'root'
})
export class TechnicianAuthService {
  public readonly ACCESS_TOKEN = 'techAccessToken';
  public readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  public readonly MENU_PERMISSIONS = 'MENU_PERMISSIONS';
  public readonly PAGE_PERMISSIONS = 'PAGE_PERMISSIONS';
  public readonly USER = 'USER';
  public readonly THEME = 'user-theme';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private router: Router,
    private technicianService: TechnicianService,
    private notifyService: NotifyService
  ) {}

  // Login method to authenticate and store the token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.technicianService.loginApi(credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          const { techAccessToken } = response.data;
          this.storeToken(techAccessToken);
          const { userData } = response.data.userInfo;
          //Add userData in localStorage
          
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(err => {
        this.notifyService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  // Log out the user
  logOut(): void {
    this.clearToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/container']);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Store the token in localStorage
  private storeToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.ACCESS_TOKEN, token);
    }
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.ACCESS_TOKEN);
    }
    return null;
  }

  // Clear the token from localStorage
  private clearToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.ACCESS_TOKEN);
    }
  }

  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  // Check if the token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp ? new Date(decodedToken.exp * 1000) : null;
      return expirationTime ? expirationTime < new Date() : true;
    } catch (error) {   
      return true; // Assume expired if decoding fails
    }
  }
}
