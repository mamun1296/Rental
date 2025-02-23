import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgencyRegistrationService } from '../agency-registration/agency-registration.service';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    FormsModule    
  ],
  providers:[
    AgencyRegistrationService,
    UserService
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{

  dashboardForm: FormGroup;

  pageNumber: number = 1;
  pageSize: number = 15;
  agencyListPageConfig: any;

  constructor(private fb: FormBuilder, private router: Router,
    private freeTrialService: AgencyRegistrationService, private userService: UserService
    ) {

    this.agencyListPageConfig = this.userService.pageConfigInit("agencyList", this.pageSize, 1, 0);
    this.dashboardForm = this.fb.group({
      name: new FormControl(''),
      emailAddress: new FormControl(''),
      agencyName: new FormControl(''),
      contactNumber: new FormControl(''),
      selectedService: new FormControl(''),
      serviceID: new FormControl(''),
      isPurchase: new FormControl(false),
      isActive: new FormControl(0),
      isApproved: new FormControl(0),
      stateStatus: new FormControl(''),
      isTrialRegistration: new FormControl(0),
      usesDays: new FormControl(0),
      userName: new FormControl(''),
      agencyID: new FormControl('')
    });
  }

  ngOnInit(): void {      

    this.getAgencyList();
  }
  
  // userLoginData: any;    
  // getUserLoginData(): void {
  //   const storedUserData = localStorage.getItem('userLoginData');
  //   if (storedUserData) {
  //     this.userLoginData = JSON.parse(storedUserData);  
  //   } else {
  //     console.error('No user data found in localStorage.');
  //   }
  // }
  
  agencyList: any[] = [];
  getAgencyList() {
    debugger
    const params = this.dashboardForm.value; 
  
    this.freeTrialService.getAgencyList(params).subscribe(
      (response) => {
       // console.log('API Response:', response);
        this.agencyList = response.body?.data || [];
        const pagination = response.headers.get('X-Pagination');
        if (pagination) {
         // console.log('Pagination:', pagination);
          this.agencyListPageConfig = JSON.parse(pagination);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  



  onSubmit(): void {
    if (this.dashboardForm.valid) {
      console.log('Form Submitted:', this.dashboardForm.value);
      alert('Form submitted successfully!');
      this.dashboardForm.reset();
    }
  }



}