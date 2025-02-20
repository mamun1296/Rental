import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { AuthService } from '../../services/auth-services/auth.service';
import { NotifyService } from '../../services/notify-services/notify.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,  
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
     private notifyService: NotifyService) {
    this.loginForm = this.fb.group({
      email:  new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  backToPrimaryHeader(): void {
    this.router.navigate(['/layout-container']);
  }

  backToFreeTrial(): void {
    this.router.navigate(['/free-trial']);
  }

  successMessage: string='';
  login(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.successMessage = ''; 
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response: any) => {    
          localStorage.setItem('accessToken', response.data.token);     
          //console.log(" response.data.token ",  response.data.token)  
          this.successMessage = 'Login successful.';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/admin-dashboard']);
          }, 1000);
        },
        error: (error: any) => {     
          if (error.status === 401) {
            if (error.error?.message === 'Invalid Email.') {
              this.errorMessage = 'Invalid email. Please check your email address.';
            } else if (error.error?.message === 'Invalid Password.') {
              this.errorMessage = 'Invalid password. Please try again.';
            } else {
              this.errorMessage = 'Login failed. Please try again.';
            }
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
       
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      
    }
  }
  
  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/layout-container']);
  }
}
