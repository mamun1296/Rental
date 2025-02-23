import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../services/auth-services/auth.service';
import { NotifyService } from '../services/notify-services/notify.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-logintest',
  standalone: true,
  imports: [
    NgIf ,
    CommonModule,
        ReactiveFormsModule,
        RouterModule 
  ],
  templateUrl: './logintest.component.html',
  styleUrl: './logintest.component.scss'
})
export class LogintestComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string='';
constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
     private notifyService: NotifyService) {
      debugger
      this.loginForm = this.fb.group({
        userName:  new FormControl('', [Validators.required, Validators.minLength(5)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        isAdmin: new FormControl(false),
        registrationType: new FormControl('')
      });
      
  }

  backToPrimaryHeader(): void {
    this.router.navigate(['/layout-container']);
  }

  

  
  //....................................................................... Start Login .......................................................................



  backToLayoutContainer(): void {
    this.router.navigate(['/layout-container']);
  }

  backToFreeTrial(): void {
    this.router.navigate(['/free-trial']);
  }

 
  

  btnLogin: boolean=false;

  login(): void {
    if (this.loginForm.valid) {
      this.btnLogin = true;
     debugger
      // const isAdmin = this.loginForm.controls['isAdmin'].value;
      // const isEmployee = this.loginForm.controls['isEmployee']?.value || false; 
  
      // let registrationType = 'Agency';
      // if (isAdmin) {
      //   registrationType = 'Admin';
      // } else{
      //   registrationType = 'Employee';
      // }  
      // this.loginForm.controls['registrationType'].setValue(registrationType);

      const loginData = this.loginForm.value;
  
      // Perform login
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          try {                    
            localStorage.setItem('accessToken', response?.data?.token);
            
            const userLoginData = response.data.userInfo;
            localStorage.setItem('userLoginData', JSON.stringify(userLoginData));
  
            const decryptedMenu = this.authService.decrypt(response?.data?.userMenu);
            const userMenu = JSON.parse(decryptedMenu);
       
            localStorage.setItem('MENU_PERMISSIONS', JSON.stringify(userMenu));
  
            this.notifyService.showMessage('success', 'Login successful.');
  
            switch (userLoginData.registrationType) {
              case 'Admin':
              this.router.navigate(['/admin-dashboard']);
              break;
              case 'Agency':
              case 'Employee':             
              this.router.navigate(['/landlord']);
              break;
              case 'TENANT':
              this.router.navigate(['/tenant-dashboard']);
              break;
              case 'LANDLORD':
              this.router.navigate(['/landlord-dashboard']);
              break;
              default:
              this.notifyService.showMessage('warning', 'Unknown registration type.');
              break;
            }
          } catch (error) {
            console.error("Error during user data processing:", error);
            this.notifyService.showMessage('error', 'An error occurred while processing the user data.');
            this.btnLogin = false;
          }
        },
        error: (error: any) => {
          this.handleLoginError(error);
        },
        complete: () => {
          this.btnLogin = false;
        }
      });
    } else {
      this.notifyService.showMessage('warning', 'Please fill out the form correctly.');
    }
  }
  
   
  private handleLoginError(error: any): void {
    if (error?.error?.message === 'Invalid Email.') {
      this.notifyService.showMessage('warning', 'Invalid Email.');
      Swal.fire({
        icon: 'warning',
        title: 'Unauthorized',
        text: 'Invalid Username.',
        confirmButtonText: 'OK'
      });
      this.btnLogin = false;
    } else if (error?.error?.message === 'Invalid Password.') {
      this.notifyService.showMessage('warning', 'Invalid Password.');
      Swal.fire({
        icon: 'warning',
        title: 'Unauthorized',
        text: 'Invalid password.',
        confirmButtonText: 'OK'
      });
      this.btnLogin = false;
    } else {
      this.notifyService.showMessage('error', 'An unexpected error occurred.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
        confirmButtonText: 'OK'
      });
      this.btnLogin = false;
    }
  }
  
  logout(): void {  
    
    localStorage.removeItem('accessToken'); 
    //this.pagePermissionsService.clearIds();
    //this.pagePermissionsService.clearPagePermissions();
    //this.menuPermissionsService.clearMenuPermissions();
    //this.pagePermissionsService.clearIds();

    this.router.navigate(['/layout-container']);
  }


  ///....................................................................... End Login .......................................................................

  





}
