import { Component, inject } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgencyRegistrationService } from './agency-registration.service';
import { NotifyService } from '../../services/notify-services/notify.service';

@Component({
  selector: 'app-agency-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './agency-registration.component.html',
  styleUrl: './agency-registration.component.scss'
})
export class AgencyRegistrationComponent {

   //private apiEndpoint = 'http://localhost:5000/api/UserManagement/SaveAgencyInfo';
  
   private notifyService = inject(NotifyService); 

  

   freeTrialForm: FormGroup;
   constructor(
     private router: Router,
     private fb: FormBuilder, private freeTrialService: AgencyRegistrationService, 
     private datePipe: DatePipe
    
   ) {
     // Initialize the form group with default values and validators
     this.freeTrialForm = this.fb.group({
       name: new FormControl('', [Validators.required]),
       emailAddress: new FormControl('', [Validators.required, Validators.email]),
       agencyName: new FormControl('', [Validators.required]),
       contactNumber: new FormControl(''),
       selectedService: new FormControl('', [Validators.required]),
       serviceID: new FormControl(''),
       isPurchase: new FormControl(false),
       isActive: new FormControl(true),
       isApproved: new FormControl(true),
       stateStatus: new FormControl('Approved'),
       isTrialRegistration: new FormControl(true),
       usesDays: new FormControl(14),
       userName: new FormControl(''),
       agencyID: new FormControl(''),
       registrationStartDate: new FormControl(null),
       registrationExpiredDate: new FormControl(null)
     });
 
     this.setDefaultRegistrationDates();
   }
 
   backToHome(): void {
     this.router.navigate(['/primary-header']);
   }
 
   ngOnInit() {
     this.freeTrialForm.get('usesDays')?.valueChanges.subscribe((days) => {
       const currentDate = new Date();
       const expirationDate = new Date(currentDate);
       expirationDate.setDate(expirationDate.getDate() + days);
       const formattedEndDate = this.datePipe.transform(expirationDate, 'yyyy-MM-dd');
   
       this.freeTrialForm.patchValue({
         registrationExpiredDate: formattedEndDate
       });
     });
   }
 
   setDefaultRegistrationDates() {
     const currentDate = new Date();
     const formattedStartDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
     const expirationDate = new Date(currentDate);
     expirationDate.setDate(expirationDate.getDate() + this.freeTrialForm.value.usesDays);
     const formattedEndDate = this.datePipe.transform(expirationDate, 'yyyy-MM-dd');
   
     this.freeTrialForm.patchValue({
       registrationStartDate: formattedStartDate,
       registrationExpiredDate: formattedEndDate
     });
   }
   
 //  btnSubmit: boolean= false;
 //  onSubmit() {
 //      if (this.freeTrialForm.valid) {
 //        const formData = this.freeTrialForm.value;
 //          const payload = {
 //          agency: {
 //          name: formData.name,
           // emailAddress: formData.emailAddress,
           // agencyName: formData.agencyName,
           // contactNumber: formData.contactNumber,
           // selectedService: formData.selectedService,
           // isPurchase: formData.isPurchase,
           // isTrialRegistration: formData.isTrialRegistration,
           // usesDays: formData.usesDays,
           // userName: formData.emailAddress,
           // isActive: formData.isActive,
           // isApproved: formData.isApproved,
           // stateStatus: formData.stateStatus, 
           // agencyID: formData.agencyID,
           // registrationStartDate: formData.registrationStartDate,
           // registrationExpiredDate: formData.registrationExpiredDate
 //          },
 //          agencyWiseServices: [
 //            {
 //              serviceID: formData.selectedService
 //            }
 //          ]
 //        };     
    
 //        this.freeTrialService.insert(payload).subscribe({
 //         next: (response: any) => {
 //           this.openDialog(); // Call this method to show the dialog
 //           this.freeTrialForm.reset(); // Reset form on success
 //           this.btnSubmit = false;
 //         },
 //         error: (error: any) => {
 //           this.openDialog(); 
 //           this.btnSubmit = false;
 //         }
 //       });
 //     } else {
 //       this.openDialog();
 //     }
 //   }
 
   onSubmit() {
     if (this.freeTrialForm.valid) {
       const formData = this.freeTrialForm.value;
         const payload = {
         agency: {
           name: formData.name,
           emailAddress: formData.emailAddress,
           agencyName: formData.agencyName,
           contactNumber: formData.contactNumber,
           selectedService: formData.selectedService,
           isPurchase: formData.isPurchase,
           isTrialRegistration: formData.isTrialRegistration,
           usesDays: formData.usesDays,
           userName: formData.emailAddress,
           isActive: formData.isActive,
           isApproved: formData.isApproved,
           stateStatus: formData.stateStatus, 
           agencyID: formData.agencyID,
           registrationStartDate: formData.registrationStartDate,
           registrationExpiredDate: formData.registrationExpiredDate
         },
         agencyWiseServices: [
           {
             serviceID: formData.selectedService
           }
         ]
       };     
       //console.log("his.freeTrialForm.value : ", this.freeTrialForm.value)
     
       this.freeTrialService.insert(payload).subscribe({
         next: (response: any) => {
           //console.log('Form data saved successfully!', response);
           alert('Registration Successful.');
           this.router.navigate(['/home']);
 
           this.freeTrialForm.reset();
         },
         error: (error: any) => {
           console.error('Error saving form data:', error);
           alert('Failed to register! Please try again.');
         }
       });
     } else {
       console.log('Form is invalid!', this.freeTrialForm.errors);
       alert('Please correct the errors in the form.');
     }
   }
 
 
 
 

 //   btnSubmit: boolean= false;
 //   onSubmit() {
 //       if (this.freeTrialForm.valid) {
 //         const formData = this.freeTrialForm.value;
 //           const payload = {
 //           agency: {
 //             name: formData.name,
 //             emailAddress: formData.emailAddress,
 //             agencyName: formData.agencyName,
 //             contactNumber: formData.contactNumber,
 //             selectedService: formData.selectedService,
 //             isPurchase: formData.isPurchase,
 //             isTrialRegistration: formData.isTrialRegistration,
 //             usesDays: formData.usesDays,
 //             userName: formData.emailAddress,
             
 //           },
 //           agencyWiseServices: [
 //             {
 //               serviceID: formData.serviceID
 //             }
 //           ]
 //         };     
     
 //         this.freeTrialService.insert(payload).subscribe({
 //           next: (response: any) => {
 //             console.log('Form data saved successfully!', response);
 //             this.utilityService.success("Data has been saved successfully.", "Server Response", 3000)
 //             this.btnSubmit = false;
 //         },
 //         error: (error: any) => {
 //             this.utilityService.warning(error, "Server Response", 3000);
 //             this.btnSubmit = false;
 //         }
 //     })
 //   }
 //   else {
 //     this.utilityService.fail("Invalid Form Submission", "Site Response");
 //   }
 //  }

}
