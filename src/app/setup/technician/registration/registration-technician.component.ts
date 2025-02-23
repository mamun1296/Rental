import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { TechnicianService } from '../technician.service';
import { CommonModule } from '@angular/common';

import { TechnicianAuthService } from '../technician-auth.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
  selector: 'app-registration-technician',
  standalone: true,
  imports: [
    CommonModule, // Include this for *ngIf
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './registration-technician.component.html',
  styleUrl: './registration-technician.component.scss'
})
export class RegistrationTechnicianComponent implements OnInit{
    registrationForm!: FormGroup;

  constructor(private fb: FormBuilder
    , private router: Router
    , private technicianAuthService: TechnicianAuthService
    , private notifyService: NotifyService
    , private technicianService: TechnicianService
    ) 
    {
      this.loginForm = this.fb.group({
        userName:  new FormControl('', [Validators.required, Validators.minLength(4)]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),    
      });
  
      if(this.showLoginForm==false){
        this.registrationForm = this.fb.group({
          id: new FormControl(0),  
          technicianID: new FormControl(''),
          agencyID: new FormControl(''),
          technicianName: new FormControl('', [Validators.required]),
          emailAddress: new FormControl('', [Validators.required, Validators.email]),
          contactNumber: new FormControl('', [Validators.required]),
          userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
          password: new FormControl('',[Validators.required, Validators.minLength(4)]),  
          technicianCategoryID: new FormControl('', [Validators.required]),
          technicianCategoryName: new FormControl(''),
          address: new FormControl('', [Validators.required]),
          stateStatus: new FormControl('Pending'),
          isActive: new FormControl(true),
          isApproved: new FormControl(false),           
       
        });
  
       
      }
    }
        
        
      ngOnInit(): void { 
      
      }
  
      // userLoginData: any;
      // getUserLoginData(): void {
      //   const storedUserData = localStorage.getItem('userLoginData');
      //   if (storedUserData) {
      //     this.userLoginData = JSON.parse(storedUserData);
      //     //console.log('User Data:', this.userData);
      //   } else {
      //     console.error('No user data found in localStorage.');
      //   }
      // }
  
  
  
    showLoginForm: boolean = true;
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
  
      if (!this.showLoginForm && !this.registrationForm) {
        this.registrationFormInit();
      }
    }
  
    // password toogle
    passwordVisible: boolean = false;
    togglePasswordVisibility(): void {
      this.passwordVisible = !this.passwordVisible;
    }
  
    registrationFormInit() {
      this.registrationForm = this.fb.group({
        id: new FormControl(0),  
        technicianID: new FormControl(''),
        agencyID: new FormControl(''),
        technicianName: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required, Validators.email]),
        contactNumber: new FormControl('', [Validators.required]),
        userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
        password: new FormControl('',[Validators.required, Validators.minLength(4)]),  
        technicianCategoryID: new FormControl('', [Validators.required]),
        technicianCategoryName: new FormControl(''),
        address: new FormControl('', [Validators.required]),
        stateStatus: new FormControl('Pending'),
        isActive: new FormControl(true),
        isApproved: new FormControl(false),         
      }); 
      
    }
  
  
  
  
    //....................................................................... Start Login .......................................................................
  
    loginForm!: FormGroup;
    errorMessage: string = '';  
  
    successMessage: string='';

    btnLogin: boolean = false;
    login(): void {
      if (this.loginForm.valid) {
         const loginData = this.loginForm.value;  
  
      this.technicianAuthService.login(loginData).subscribe({
          next: (response: any) => {
            // Handle successful login             
            localStorage.setItem('techAccessToken', response.data.token);
            const userLoginData = response.data.userInfo;
  
            localStorage.setItem('userLoginData', JSON.stringify(userLoginData));         
            if(response?.message === 'Login Successful.'){
              this.notifyService.showMessage('success', 'Login Successful.');         
                //this.router.navigate(['/agency-dashboard']);              
            }         
  
          },
          error: (error: any) => {         
            //console.log("error message : ", error?.error?.message);   
            if(error?.error?.message === 'Invalid Username.'){
              this.notifyService.showMessage('warning', 'Invalid Username.');
            }
            if(error?.error?.message === 'Invalid Password.'){
              this.notifyService.showMessage('warning', 'Invalid Password.');
            }
          },
        });
      }
      else {
        // Show warning if form is invalid
        this.notifyService.showMessage('warning', 'Please fill out the form correctly.');
      }
    }
  
    logout(): void {
        localStorage.removeItem('techAccessToken');
        this.router.navigate(['/layout-container']);
    }
  
  
    ///....................................................................... End Login .......................................................................
 
  
  
  
    btnRegistration: boolean = false;
    registrationSubmit(): void {  
      // Check if the form is valid before proceeding
      if (this.registrationForm.valid) {
        this.btnRegistration = true; 
        const formData = this.registrationForm.value;     

        // Call the API service to submit the form
        this.technicianService.registration(formData).subscribe({
          next: (response: any) => {
            if (response?.data?.isDuplicateEmail) {
              this.notifyService.showMessage('warning', 'Email already exists!.');      
            } 
            if (response?.data?.isDuplicateUser) {
              this.notifyService.showMessage('warning', 'Username already exists!.');      
            } 
            if (response?.data?.isDuplicateContact) {
              this.notifyService.showMessage('warning', 'Contact number already exists!.');      
            } 
            if (response?.data?.status) {
              this.notifyService.showMessage('success', 'Registration Successful.');
              //this.router.navigate(['/layout-container']);

              this.registrationForm.reset();
            }
          },
          error: (error: any) => {        
            if (error.status === 400) {
              this.notifyService.showMessage('error', 'Invalid request! Please check your data.');         
            } else if (error.status === 422) {
              this.notifyService.showMessage('error','Validation error! Please correct the errors.');        
            } else {
              this.notifyService.showMessage('error', 'Failed to register! Please try again.'); 
            }
          },
        });
      } else {       
        this.notifyService.showMessage('error', 'Please correct the errors in the form.'); 
      }
    }
    
    
}


