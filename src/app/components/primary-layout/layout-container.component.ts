
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AgencyRegistrationService } from '../agency-registration/agency-registration.service';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-services/auth.service';
import { NotifyService } from '../../services/notify-services/notify.service';
import { PagePermissionsService } from '../../services/page-permissions-service/page-permissions.service';
import { MenuPermissionsService } from '../../services/menu-permissions-service/menu-permissions.service';

@Component({
  selector: 'app-layout-container',
  standalone: true,
  imports: [
    CommonModule, // Include this for *ngIf
    ReactiveFormsModule,
    RouterModule,
  ],
  providers:[
    DatePipe
  ],
  templateUrl: './layout-container.component.html',
  styleUrl: './layout-container.component.scss'
})

export class LayoutContainerComponent implements OnInit{

  constructor(private fb: FormBuilder, private router: Router,
     private authService: AuthService, private notifyService: NotifyService,
  private registrationService: AgencyRegistrationService,
   private pagePermissionsService: PagePermissionsService,
    private menuPermissionsService: MenuPermissionsService,
  private datePipe: DatePipe
    ) {

    this.loginForm = this.fb.group({
      userName:  new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      isAdmin: new FormControl(false),
      registrationType: new FormControl('')
    });

    if(this.showLoginForm==false){
      this.registrationForm = this.fb.group({
        name: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required, Validators.email]),
        agencyName: new FormControl('', [Validators.required]),
        contactNumber: new FormControl(''),
        selectedService: new FormControl('', [Validators.required]),
        serviceID: new FormControl(''),
        isTrialRegistration: new FormControl(false),
        isPurchase: new FormControl(false),
        isActive: new FormControl(true),
        isApproved: new FormControl(true),
        stateStatus: new FormControl('Approved'),
        usesDays: new FormControl(0),
        userName: new FormControl(''),
        agencyID: new FormControl(''),
        registrationStartDate: new FormControl(null),
        registrationExpiredDate: new FormControl(null),
        paymentMode: new FormControl(''),
        cardHolderName: new FormControl(''),
        cardNumber: new FormControl(''),
        cardVerificationCode: new FormControl(''),
        expirationDate: new FormControl(null),
      });

      this.setDefaultRegistrationDates();
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
      this.createRegistrationForm();
    }
  }

  // password toogle
  passwordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  private createRegistrationForm() {
    this.registrationForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      agencyName: new FormControl('', [Validators.required]),
      contactNumber: new FormControl(''),
      selectedServices: this.fb.array(
        this.services.map(() => this.fb.control(false, Validators.required))
      ),

      serviceID: new FormControl(''),
      isTrialRegistration: new FormControl(false),
      isPurchase: new FormControl(false),
      isActive: new FormControl(true),
      isApproved: new FormControl(true),
      stateStatus: new FormControl('Approved'),
      usesDays: new FormControl(0),
      userName: new FormControl(''),
      agencyID: new FormControl(''),
      registrationStartDate: new FormControl(null),
      registrationExpiredDate: new FormControl(null),
      paymentMode: new FormControl(''),
      cardHolderName: new FormControl(''),
      cardNumber: new FormControl(''),
      cardVerificationCode: new FormControl(''),
      expirationDate: new FormControl(null),
    });

    this.setDefaultRegistrationDates();
  }




  //....................................................................... Start Login .......................................................................

  loginForm: FormGroup;
  errorMessage: string = '';

  backToLayoutContainer(): void {
    this.router.navigate(['/layout-container']);
  }

  backToFreeTrial(): void {
    this.router.navigate(['/free-trial']);
  }

  successMessage: string='';
  // login(): void {
  //   if (this.loginForm.valid) {
  //     this.errorMessage = '';
  //     this.successMessage = '';
  //     const loginData = this.loginForm.value;
  //     this.authService.login(loginData).subscribe({
  //       next: (response: any) => {
  //         localStorage.setItem('accessToken', response.data.token);
  //         console.log(" response.data.token ",  response.data.token)
  //         this.successMessage = 'Login successful.';
  //         setTimeout(() => {
  //           this.successMessage = '';
  //           this.router.navigate(['/admin-dashboard']);
  //         }, 2000);
  //       },
  //       error: (error: any) => {
  //         if (error.status === 401) {
  //           if (error.error?.message === 'Invalid Email.') {
  //             this.errorMessage = 'Invalid email. Please check your email address.';
  //           } else if (error.error?.message === 'Invalid Password.') {
  //             this.errorMessage = 'Invalid password. Please try again.';
  //           } else {
  //             this.errorMessage = 'Login failed. Please try again.';
  //           }
  //         } else {
  //           this.errorMessage = 'An unexpected error occurred. Please try again.';
  //         }

  //         setTimeout(() => {
  //           this.errorMessage = '';
  //         }, 5000);
  //       }
  //     });
  //   } else {

  //   }
  // }

  btnLogin: boolean=false;

  login(): void {
    debugger
    if (this.loginForm.valid) {
      this.btnLogin = true;
  
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
            const userMenus = JSON.parse(decryptedMenu);
            console.log("userMenus ", userMenus);
            localStorage.setItem('MENU_PERMISSIONS', JSON.stringify(userMenus));
            
            this.notifyService.showMessage('success', 'Login successful.');
            switch (userLoginData.registrationType) {
              case 'Admin':
              this.router.navigate(['/admin-dashboard']);
              break;
              case 'Agency':
              case 'Employee':             
              this.router.navigate(['/complain']);
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
    debugger
    localStorage.removeItem('accessToken'); 
    this.pagePermissionsService.clearIds();
    this.pagePermissionsService.clearPagePermissions();
    this.menuPermissionsService.clearMenuPermissions();
    this.pagePermissionsService.clearIds();

    this.router.navigate(['/layout-container']);
  }


  ///....................................................................... End Login .......................................................................

   // purchase checkbox
  selectedOption: string = '';


getFormControl(index: number): FormControl {
  return this.selectedServices.at(index) as FormControl;
}

get selectedServices(): FormArray {
  return this.registrationForm.get('selectedServices') as FormArray;
}

get isTrialSelected(): boolean {
  return this.registrationForm.get('isTrialRegistration')?.value;
}

get isPurchaseSelected(): boolean {
  return this.registrationForm.get('isPurchase')?.value;
}

// onOptionChange(option: string): void {
//   if (option === 'trial') {
//     const isTrialChecked = this.registrationForm.get('isTrialRegistration')?.value;

//     this.registrationForm.patchValue({
//       isTrialRegistration: isTrialChecked,
//       isPurchase: false,
//     });

//     this.selectedServices.controls.forEach((control, index) => {
//       control.setValue(false); // Reset all selections
//       control.disable(); // Disable all but one service selection
//     });

//     // Enable only one service
//     if (isTrialChecked) {
//       this.selectedServices.controls[0].enable(); // Allow only the first service for the trial
//     }
//   } else if (option === 'purchase') {
//     const isPurchaseChecked = this.registrationForm.get('isPurchase')?.value;

//     this.registrationForm.patchValue({
//       isTrialRegistration: false,
//       isPurchase: isPurchaseChecked,
//     });

//     this.selectedServices.controls.forEach((control) => {
//       control.setValue(false); // Reset all selections
//       if (isPurchaseChecked) {
//         control.enable(); // Allow all services for purchase
//       } else {
//         control.disable(); // Disable selection
//       }
//     });
//   }
// }



  registrationForm!: FormGroup;
  services = [
    { id: 'S0001', name: 'Property Maintenance' },
    { id: 'S0002', name: 'Rental Service' },
    { id: 'S0003', name: 'Property Construction' }
  ];



  setDefaultRegistrationDates() {
    const currentDate = new Date();
    const trialDays = this.registrationForm?.value?.usesDays || 0;

    const formattedStartDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    const regExpiredDate = new Date(currentDate);
    regExpiredDate.setDate(regExpiredDate.getDate() + trialDays);
    const formattedEndDate = this.datePipe.transform(regExpiredDate, 'yyyy-MM-dd');

    this.registrationForm?.patchValue({
      registrationStartDate: formattedStartDate,
      registrationExpiredDate: formattedEndDate,
    });
  }

//  onOptionChange(option: string): void {
//   if (option === 'trial') {
//     const isTrialChecked = this.registrationForm.get('isTrialRegistration')?.value;

//     this.registrationForm.patchValue({
//       isTrialRegistration: isTrialChecked,
//       isPurchase: false,
//       registrationStartDate: null,
//       registrationExpiredDate: null,
//       paymentMode: '',
//       cardHolderName: '',
//       cardNumber: '',
//       cardVerificationCode: '',
//       expirationDate: null,

//     });

//     this.selectedServices.controls.forEach((control, index) => {
//       control.setValue(false); // Reset all selections
//       control.disable(); // Disable all but one service selection
//     });

//     // Enable only one service
//     if (isTrialChecked) {
//       this.selectedServices.controls[0].enable(); // Allow only the first service for the trial
//     }
//   }
//   else if (option === 'purchase') {
//     const isPurchaseChecked = this.registrationForm.get('isPurchase')?.value;

//     this.registrationForm.patchValue({
//       isTrialRegistration: false,
//       isPurchase: isPurchaseChecked,
//     });

//     // Check and enable all services when Purchase is selected
//     this.selectedServices.controls.forEach((control) => {
//       control.setValue(isPurchaseChecked); // Set true for all checkboxes
//       control.enable(); // Ensure all services are enabled
//     });
//   }
// }

onOptionChange(option: string): void {
  if (option == 'trial') {
    let isTrialChecked = this.registrationForm.get('isTrialRegistration')?.value;

    // Reset Purchase-related fields
    this.registrationForm.patchValue({
      isTrialRegistration: isTrialChecked,
      isPurchase: false,
    });

    // Enable all checkboxes and reset to unchecked
    this.selectedServices.controls.forEach((control) => {
      control.enable();   // Ensure all controls are enabled
      control.setValue(false); // Uncheck all checkboxes
    });

    // Handle single checkbox selection logic for Trial option
    this.handleSingleSelection();
  }

  if (option == 'purchase') {
    let isPurchaseChecked = this.registrationForm.get('isPurchase')?.value;

    // Uncheck Trial checkbox
    this.registrationForm.patchValue({
      isTrialRegistration: false,
      isPurchase: isPurchaseChecked,
    });

    // Enable and check all checkboxes
    this.selectedServices.controls.forEach((control) => {
      control.enable();   // Ensure all checkboxes are enabled
      control.setValue(true); // Check all checkboxes
    });
  }
}

// Handle single checkbox selection for trial option
handleSingleSelection(): void {
  this.selectedServices.controls.forEach((control, index) => {
    control.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        // Uncheck all other checkboxes except the selected one
        this.selectedServices.controls.forEach((ctrl, i) => {
          if (i != index) {
            ctrl.setValue(false, { emitEvent: false }); // Prevent infinite loop
          }
        });
      }
    });
  });
}




  // registrationSubmit(): void {
  //   var isPur = false;
  //   var isTrial = false;
  //   var trialDays = 0;

  //   if (this.selectedOption === 'purchase') {
  //     isPur = true;
  //     isTrial = false;
  //   } else {
  //     isPur = false;
  //     isTrial = true;
  //     trialDays = 14;
  //   }

  //   if (this.registrationForm.valid) {

  //     const selectedServices = this.services.filter((_, index) =>
  //       this.selectedServices.at(index).value
  //     );

  //     const formData = this.registrationForm.value;

  //     const payload = {
  //       agency: {
  //         name: formData.name,
  //         emailAddress: formData.emailAddress,
  //         agencyName: formData.agencyName,
  //         contactNumber: formData.contactNumber,
  //         selectedServices: selectedServices.map((service) => service.id),
  //         isPurchase: isPur,
  //         isTrialRegistration: isTrial,
  //         usesDays: trialDays,
  //         userName: formData.emailAddress,
  //         isActive: formData.isActive || true,
  //         isApproved: formData.isApproved || true,
  //         stateStatus: formData.stateStatus || 'Approved',
  //         agencyID: formData.agencyID || null,
  //         registrationStartDate: formData.registrationStartDate || null,
  //         registrationExpiredDate: formData.registrationExpiredDate || null,
  //         cardHolderName: formData.cardHolderName || null,
  //         cardNumber: formData.cardNumber || null,
  //         cardVerificationCode: formData.cardVerificationCode || null,
  //         expirationDate: this.datePipe.transform(formData.expirationDate, 'yyyy-MM-dd') || null,
  //         paymentMode: formData.paymentMode || null,
  //       },
  //       agencyWiseServices: [
  //         {
  //           serviceID: formData.selectedService,
  //         },
  //       ],
  //     };

  //     console.log('Payload:', payload);
  //     return;
  //     this.registrationService.insert(payload).subscribe({
  //       next: (response: any) => {
  //       //console.log('Form data saved successfully!', response);

  //         if(response.message=='Email already exists!'){
  //           alert('Email already exists!');
  //         }
  //         else{
  //             //this.notifyService.showMessage('success', 'Registration successful.');
  //           alert('Registration Successful.');
  //           this.router.navigate(['/layout-container']);
  //           this.registrationForm.reset();
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Error occurred:', error);
  //         alert('Failed to register! Please try again.');
  //       },
  //     });
  //   } else {
  //     console.log('Form is invalid!', this.registrationForm.errors);
  //     alert('Please correct the errors in the form.');
  //   }
  // }

  btnRegistration: boolean = false;
  registrationSubmit(): void {
    let isPurchase = this.registrationForm.get('isPurchase')?.value || false;
    let isTrial = this.registrationForm.get('isTrialRegistration')?.value || false;

    // Check if the form is valid before proceeding
    if (this.registrationForm.valid) {
      this.btnRegistration = true;
      // Filter out the selected services (checkboxes)
      const selectedServices = this.services.filter((_, index) =>
        this.selectedServices.at(index).value
      );

      // Build the payload
      const formData = this.registrationForm.value;
      const payload = {
        agency: {
          name: formData.name?.toString() || null,
          emailAddress: formData.emailAddress?.toString() || null,
          agencyName: formData.agencyName?.toString() || null,
          contactNumber: formData.contactNumber?.toString() || null,
          isPurchase: isPurchase,
          isTrialRegistration: isTrial,
          usesDays: isTrial ? 14 : 0, // Set trial days if applicable
          userName: formData.emailAddress?.toString() || null,
          isActive: formData.isActive || true,
          isApproved: formData.isApproved || true,
          stateStatus: formData.stateStatus || 'Approved',
          agencyID: formData.agencyID || null,
          registrationStartDate: formData.registrationStartDate || null,
          registrationExpiredDate: formData.registrationExpiredDate || null,
          cardHolderName: formData.cardHolderName?.toString() || null,
          cardNumber: formData.cardNumber?.toString() || null,
          cardVerificationCode: formData.cardVerificationCode?.toString() || null,
          expirationDate: this.datePipe.transform(formData.expirationDate, 'yyyy-MM-dd') || null,
          //expirationDate: formData.expirationDate.toString || null,
          paymentMode: formData.paymentMode?.toString() || null,
        },
        agencyWiseServices: selectedServices.map(service => ({
          serviceID: service.id, // Add the service ID
        })),
      };

      // Debug payload in console (remove for production)
     // console.log('Payload:', payload);
     // Call the API service to submit the form
    this.registrationService.insert(payload).subscribe({
      next: (response: any) => {
        if (response?.data?.isDuplicate) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Email',
            text: 'Email already exists!',
            confirmButtonText: 'OK'
          });
        } 
        if (response?.data?.status) {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your registration was successful.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/layout-container']);
            this.showLoginForm = true;
            this.registrationForm.reset();
          });
        }
      },
      error: (error: any) => {
        console.error('Error occurred:', error); // Log detailed error
        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Request',
            text: 'Please check your data.',
            confirmButtonText: 'OK'
          });
        } else if (error.status === 422) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please correct the errors in the form.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Failed to register! Please try again.',
            confirmButtonText: 'OK'
          });
        }
      },
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Form Invalid',
      text: 'Please correct the errors in the form.',
      confirmButtonText: 'OK'
    });
  }
}


}


