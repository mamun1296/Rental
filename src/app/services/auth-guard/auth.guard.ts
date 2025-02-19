import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { AuthService } from '../auth-services/auth.service';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {
  userLoginData: any;
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('accessToken');

    const storedUserData = localStorage.getItem('userLoginData');
    if (storedUserData) {
      this.userLoginData = JSON.parse(storedUserData);
    }
    const reg_type = this.userLoginData.registrationType;

    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();

            if (!isTokenExpired) {                       
                const requiredPermission = route.data['requiredPermission'] || `/${route.routeConfig?.path}`;    
                if (requiredPermission) {
                    const hasPermission = this.authService.hasMenuPermission(requiredPermission);     
                  
                    if (hasPermission) {
                        return true;
                    } else {                        
                        this.router.navigate(['/access-denied']);
                        return false;
                    }
                }              
                
            }
        } catch (error) {
            console.error('Invalid token:', error);
            this.clearLocalStorage();
        }
    } 
    return false;
}



  private clearLocalStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userLoginData');
    localStorage.removeItem('MENU_PERMISSIONS');
  }
}

