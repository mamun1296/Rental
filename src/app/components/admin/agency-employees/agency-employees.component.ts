import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AgencyEmployeesService } from './agency-employees.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { UserService } from '../../../services/user-services/user.service';

@Component({
  selector: 'app-agency-employees',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    CommonModule
  ],
  templateUrl: './agency-employees.component.html',
  styleUrl: './agency-employees.component.scss'
})
export class AgencyEmployeesComponent implements OnInit {
 
  agencyEmployeesEntryForm!: FormGroup;
  agencyEmployeesListForm!: FormGroup;

  sessionAgencyID: any;
  agencyEmployeesID: any;
  agencySearchControl = new FormControl('');
  isagencyEmployeesCategoryDropdownOpen = false;

  pageNumber: number = 1;
  pageSize: number = 15;
  listPageConfig: any;
    
  entryPage: boolean = false;
  listPage: boolean = true;
  detailsPage: boolean = false;

  @ViewChild('showagencyEmployeesModal', { static: true }) showagencyEmployeesModal!: ElementRef;

  ddlStatus: any[];

  constructor(private fb: FormBuilder, private notifyService: NotifyService,
    private userService: UserService, private agencyEmployeesService: AgencyEmployeesService,
  ) 
    {
      this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
      this.ddlStatus = this.userService.getDataStatus();
    } 
    
  ngOnInit(): void {
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID;     
    this.agencyEmployeesEntryFormInit();
    this.agencyEmployeesListFormInit();
    this.getList(this.agencyEmployeesListForm.get('searchString')?.value);     
  }


    userLoginData: any;
    getUserLoginData(): void {
      const storedUserData = localStorage.getItem('userLoginData');
      if (storedUserData) {
        this.userLoginData = JSON.parse(storedUserData);
      } else {
        console.error('No user data found in localStorage.');
      }
    }
    
      agencyEmployeesEntryFormInit(){        
        this.agencyEmployeesEntryForm = this.fb.group({
          id: new FormControl(0),  
          agencyEmpID: new FormControl(''),
          empCategoryID: new FormControl(''),
          agencyID: new FormControl(this.sessionAgencyID),
          empName: new FormControl('', [Validators.required]),
          emailAddress: new FormControl('', [Validators.required, Validators.email]),
          contactNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)]),
          address: new FormControl('', [Validators.required]),
          userName: new FormControl('', [Validators.minLength(4), Validators.maxLength(50)]),
          password: new FormControl(''),  
          stateStatus: new FormControl('Approved'),
          registrationType: new FormControl('Employee'),
          activationStatus: new FormControl('Active'),
          isActive: new FormControl(true),
          isApproved: new FormControl(true),        
        })   
          
        this.agencyEmployeesEntryForm.get('searchString')?.valueChanges.subscribe((searchValue) => {
          this.getList(searchValue);
        });
      }
  
      btnSubmit: boolean = false;
      onSubmit(): void {
          if (this.agencyEmployeesEntryForm.valid) {
            this.btnSubmit = true;
            const params = { ...this.agencyEmployeesEntryForm.value };       

            this.agencyEmployeesService.insert(params).subscribe({
              next: (response: any) => {             
                if (response?.data?.status) {
                  this.notifyService.showMessage('success', 'Employee has been successfully saved.');
                  this.getList(this.agencyEmployeesListForm.get('searchString')?.value);    
                  this.resetForm();
                }                 
                else{
                  if (response?.data?.isDuplicateEmail) {
                    this.notifyService.showMessage('warning', 'Email already exists!.');      
                  } 
                  if (response?.data?.isDuplicateUser) {
                    this.notifyService.showMessage('warning', 'User name already exists!.');      
                  } 
                  if (response?.data?.isDuplicateContact) {
                    this.notifyService.showMessage('warning', 'Contact number already exists!.');      
                  }                                    
                }
              
              },
              error: (error: any) => {
                this.notifyService.showMessage('error', 'Failed to save agencyEmployees! Please try again.');      
              }
            });
          } else {
            this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');
          
          }     
        }
      
        resetForm() {
          this.agencyEmployeesEntryForm = this.fb.group({
            id: new FormControl(0),  
            agencyEmpID: new FormControl(''),
            empCategoryID: new FormControl(''),
            agencyID: new FormControl(this.sessionAgencyID),
            empName: new FormControl('', [Validators.required]),
            emailAddress: new FormControl('', [Validators.required, Validators.email]),
            contactNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)]),
            address: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.minLength(4), Validators.maxLength(50)]),
            password: new FormControl(''),  
            stateStatus: new FormControl('Approved'),
            activationStatus: new FormControl('Active'),
            registrationType: new FormControl('Employee'),
            isActive: new FormControl(true),
            isApproved: new FormControl(true),  
          })
        }
      

        agencyEmployeesListFormInit(){        
          this.agencyEmployeesListForm = this.fb.group({
            id: new FormControl(0),  
            agencyEmpID: new FormControl(''),
            empCategoryID: new FormControl(''),
            agencyID: new FormControl(this.sessionAgencyID),
            empName: new FormControl('', [Validators.required]),
            emailAddress: new FormControl('', [Validators.required, Validators.email]),
            contactNumber: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            password: new FormControl(''),
            stateStatus: new FormControl(''),
            activationStatus: new FormControl(''),
            registrationType: new FormControl('Employee'),
            isActive: new FormControl(''),
            isApproved: new FormControl(''),
            searchString: new FormControl(''),
          })   
            
          this.agencyEmployeesListForm.get('searchString')?.valueChanges.subscribe((searchValue) => {
            this.getList(searchValue);
          });
        }


      list: any[] = [];
      getList(search: any) {    
        let params = {
          ...this.agencyEmployeesListForm.value,  searchString: search ?? ''
        };  
    
        this.agencyEmployeesService.getList(params).subscribe(
          (response: any) => {
            console.log("response ", response);
            this.list = response.body?.data?.list || [];        
            const pagination = response.headers.get('X-Pagination');
            if (pagination) {
              this.listPageConfig = JSON.parse(pagination);
            }
          },
          (error) => {
            console.error('API Error:', error);
          }
        );
      }
      

    listPageInit() {
      this.getUserLoginData();
      this.entryPage = false;
      this.listPage = true;
      this.detailsPage = false; 
      this.agencyEmployeesEntryFormInit();      
      this.getList(this.agencyEmployeesListForm.get('searchString')?.value);
    }
 
    
  
  listPageChanged(event: any) {
    this.pageNumber = event;
    this.agencyEmployeesListForm.get('pageNumber')?.setValue(this.pageNumber);
    this.getList(this.agencyEmployeesListForm.get('searchString')?.value);
  }
    
}
  

