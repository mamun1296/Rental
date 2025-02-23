import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AgencyRegistrationService } from '../agency-registration/agency-registration.service';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    FormsModule    
  ],
  providers:[
    UserService
  ],

  templateUrl: './agency-dashboard.component.html',
  styleUrl: './agency-dashboard.component.scss'
})
export class AgencyDashboardComponent implements OnInit{

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
  


  agencyList: any[] = [];
  getAgencyList() {
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
