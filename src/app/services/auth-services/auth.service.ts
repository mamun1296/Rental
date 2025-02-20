import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { NotifyService } from '../notify-services/notify.service';
import * as CryptoJS from 'crypto-js';
import { MenuPermissionsService } from '../menu-permissions-service/menu-permissions.service';
import { LoginService } from '../../components/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly ACCESS_TOKEN = 'accessToken';
  public readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  public readonly MENU_PERMISSIONS = 'MENU_PERMISSIONS';
  public readonly PAGE_PERMISSIONS = 'PAGE_PERMISSIONS';
  public readonly USER = 'USER';
  public readonly THEME = 'user-theme';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
 // private menuPermissionsService = inject(MenuPermissionsService);
  
  constructor(
    private router: Router,
    private loginApiRoutesService: LoginService,
    private notifyService: NotifyService
  ) {}

  // // Login method to authenticate and store the token
  // login(credentials: { username: string; password: string }): Observable<any> {
  //   return this.loginApiRoutesService.loginApi(credentials).pipe(
  //     tap((response: any) => {
  //       if (response.success) {
  //         const { accessToken, menuPermissions } = response.data;
          
  //         // Store the access token
  //         this.storeToken(accessToken);
  
  //         // Store menu permissions in localStorage
  //         if (menuPermissions) {
  //           localStorage.setItem(this.MENU_PERMISSIONS, JSON.stringify(menuPermissions));
  //         }
  
  //         // Optional: Store user data if needed
  //         const { userData } = response.data.userInfo;
  //         if (userData) {
  //           localStorage.setItem(this.USER, JSON.stringify(userData));
  //         }
  
  //         this.isAuthenticatedSubject.next(true);
  //       }
  //     }),
  //     catchError(err => {
  //       this.notifyService.handleError(err);
  //       return throwError(() => err);
  //     })
  //   );
  // }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.loginApiRoutesService.loginApi(credentials).pipe(
      tap((response: any) => {      

        if (response.statusCode===200) {
          try {          
            const accessToken= response.data.token;       

            const decryptedMenu = this.decrypt(response.data.userMenu);
            const menuPermissions = JSON.parse(decryptedMenu);        

            this.storeToken(accessToken);  
       
            localStorage.setItem(this.MENU_PERMISSIONS, JSON.stringify(menuPermissions));
            
      
            const userData = response.data?.userInfo;
            if (userData) {
              localStorage.setItem(this.USER, JSON.stringify(userData));
             // console.log('User data stored:', userData);
            }
  
            this.isAuthenticatedSubject.next(true);
  
          } catch (error) {
            //console.error('Error processing login response:', error);
            this.notifyService.showMessage('error', 'An error occurred during login processing.');
          }
        } else {
          //console.warn('Login response indicates failure:', response);
        }
      }),
      catchError(err => {
        console.error('Login error:', err);
        this.notifyService.handleError(err);
        return throwError(() => err);
      })
    );
  }
  


  // Log out the user
  logOut(): void {
    this.clearToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/layout-container']);
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
     // this.pagePermissionsService.clearIds();
     // this.pagePermissionsService.clearPagePermissions();
      // this.menuPermissionsService.clearMenuPermissions();
      //this.pagePermissionsService.clearIds();
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
      console.error('Error decoding token:', error);
      return true; // Assume expired if decoding fails
    }
  }


  decrypt(encryptedText: string): string {
    const key = CryptoJS.enc.Utf8.parse('7391824694761634');
    const iv = CryptoJS.enc.Utf8.parse('7391824694761634');
  
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  //public $refreshToken = new Subject<boolean>();
  //refreshToken(): Observable<any> {
  refreshToken(): void{

    // const refreshToken = localStorage.getItem('REFRESH_TOKEN');
    // const accessToken = localStorage.getItem('ACCESS_TOKEN');

    // if (refreshToken) {
    //   const tokenObject = { AccessToken: accessToken, RefreshToken: refreshToken };
    //     console.log('tokenObject', tokenObject);

    //   return this.loginApiRoutesService.refreshTokenApi(tokenObject).pipe(
    //     tap(response => {
    //       console.log('Refresh Token Response:', response);

    //       this.doLoginUser(response.data.accessToken, response.data.refreshToken, response.data.pagePermissions);
    //     }),
    //     catchError(error => {
    //       console.log('refreshToken', error);
    //       this.logOut();
    //       return throwError(() => new Error('Failed to refresh token')); 
    //     })
    //   );
    // } else {
    //   console.error('No refresh token found');
    //   return throwError(() => new Error('No refresh token found'));
    // }
  }


  hasMenuPermission(requiredPermission: string): boolean {
    //console.log("requiredPermission ", requiredPermission);

    const permissions = JSON.parse(localStorage.getItem(this.MENU_PERMISSIONS) || '[]');
    //console.log("permissions ", permissions);

    const hasPermission = permissions.some((permission: any) => permission.permissionKey === requiredPermission);
    ///console.log("hasPermission ", hasPermission);
    return hasPermission;
  }


}
