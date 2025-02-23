import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TenantService } from '../tenant.service';
import { CommonModule } from '@angular/common';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { NotifyService } from '../../../services/notify-services/notify.service';
import { UserService } from '../../../services/user-services/user.service';
import { AddTenantComponent } from '../insert-update/add-tenant.component';

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [
    CommonModule, // Ensure CommonModule is imported for basic Angular directives
    ReactiveFormsModule, // Required for Reactive Forms
    NgSelect2Module, // Import NgSelect2Module here,
    FormsModule,
    NgxPaginationModule,
    AddTenantComponent
  ],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.scss'
})

export class TenantComponent implements OnInit{  
    tenantFrom!: FormGroup;
    sessionAgencyID: any;
    tenantID: any;
    propertySearchControl = new FormControl('');
    isPropertyDropdownOpen = false;
  
    pageNumber: number = 1;
    pageSize: number = 15;
    listPageConfig: any;
  
    entryPage: boolean = false;
    listPage: boolean = true;
    detailsPage: boolean = false;
  
    @ViewChild('showAddTenantModal', { static: true }) showAddTenantModal!: ElementRef;
  
    constructor(private fb: FormBuilder, private notifyService: NotifyService, private tenantService: TenantService,
      public userService: UserService) 
      {
        this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
      }
  
   
  
    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.tenantFromInit();
      this.getTenants();  
      this.loadProperties();     
      this.searchProperty();
    }
  
      ddlProperties: any[] = [];
      loadProperties() {
        const propertyID = this.tenantFrom.controls['propertyID'].value || '';
        const agencyID = this.sessionAgencyID;
        if (!agencyID) {
          console.error("Error: agencyID is not available.");
          return;
        }
        this.tenantService
          .getPropertiesExtension<any[]>(propertyID, agencyID)
          .then((response: any) => {
            const resData = response.data || [];
            this.ddlProperties = resData.map((property: any) => ({
              id: property.id.toString(),
              text: property.text,
            }));
            this.filteredProperties = this.ddlProperties;      
          })
          .catch((error: any) => {
            console.error("Error fetching property:", error);
          });
      }
  
      propertyToggleDropdown(): void {
        this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      }
    
      selectProperty(item: { id: string; text: string }): void {
        this.tenantFrom.get('propertyID')?.setValue(item.id);
        this.propertySearchControl.setValue(item.text);
        this.isPropertyDropdownOpen = false; // Close the dropdown 
      }
  
      clearPropertySelection(): void {
        this.tenantFrom.controls['propertyID'].setValue(''); // Clear propertyID
        this.propertySearchControl.setValue(''); // Clear searchControl
        this.isPropertyDropdownOpen = false; // Optionally close the dropdown  
      } 
  
      searchProperty() {
        this.propertySearchControl.valueChanges.subscribe((value: any) => {
          this.filterProperty(value);
        });
      } 
        
      filteredProperties: any[] = [];
      filterProperty(value: string): void {
      const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
      this.filteredProperties = this.ddlProperties.filter((property) =>
        property.id.toLowerCase().includes(filterValue) || 
        property.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
      );
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
    
      tenantFromInit(){
        this.tenantFrom = this.fb.group({
          id: new FormControl(0),  
          tenantInfoID: new FormControl(''),
          agencyID: new FormControl(this.sessionAgencyID),
          propertyID: new FormControl('', [Validators.required, Validators.minLength(3)]),
          tenantID: new FormControl(''),
          tenantName: new FormControl('', [Validators.required]),
          emailAddress: new FormControl('', [Validators.email]),    
          contactNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
          address: new FormControl('', [Validators.required]),
          stateStatus: new FormControl(''),
          isActive: new FormControl(true),
          isApproved: new FormControl(true),
        })     
        this.tenantFrom.valueChanges.subscribe((value: any) => {
          this.getTenants();
        });
      }
 
      list: any[] = [];
      getTenants() {
        const params = this.tenantFrom.value;   
        this.tenantService.getTenantsInfo(params).subscribe(
          (response) => {    
            //console.log("response ", response);  
            this.list = response.body?.data?.list || [];
            const pagination = response.headers.get('X-Pagination');         
            //console.log('Pagination:', pagination);
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
        this.tenantFromInit();
        this.loadProperties();
        this.getTenants();
      }
    
      fnBackToList(event: any) {
        this.entryPage = false;
        this.listPage = true;
        this.detailsPage = false;
      }
    
      createTenant() {
        this.listPage = false;
        this.entryPage = true;
      }
    
  
    listPageChanged(event: any) {
      this.pageNumber = event;
      this.tenantFrom.get('pageNumber')?.setValue(this.pageNumber);
      this.getTenants();
    }
  
  
    expandedRows: { [key: string]: boolean } = {};
    selectedTenantDetails: { [key: string]: any[] } = {};
  
    tenantToggleDetails(tenantInfoID: string) {
      this.expandedRows[tenantInfoID] = !this.expandedRows[tenantInfoID];
      
      // Load details only if expanding
      if (this.expandedRows[tenantInfoID] && !this.selectedTenantDetails[tenantInfoID]) {
        this.loadTenantsDetails(tenantInfoID);
      }
    }  
        
    loadTenantsDetails(tenantInfoID: any): void {
      this.tenantService.loadTenantsDetails(tenantInfoID, this.sessionAgencyID).subscribe(
        (response) => {
         // console.log('API Response:', response);
          if (response.body?.data) {
            this.selectedTenantDetails[tenantInfoID] = response.body.data;
          } 
          else {        
            this.notifyService.showMessage('warning', `No data received for property.`);
            this.selectedTenantDetails[tenantInfoID] = []; // Set to an empty array to prevent undefined errors
          }
        },
        (error) => {
          console.error('Error fetching property details:', error);
        }
      );
    }
    
  
    
  
}
