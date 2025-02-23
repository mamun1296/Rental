import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { TenantComplainServiceService } from '../../tenant/complain/tenant-complain-service.service';
import { MatDialog } from '@angular/material/dialog';
import { TenantService } from '../../tenant/tenant.service';

import { LanlordService } from '../../landlord/landlord.service';
import { Router } from '@angular/router';
import { ComplainService } from '../../complain/complain.service';
import { map } from 'rxjs';
import { TechnicianAssignService } from '../../technician-assign/technician-assign.service';
import { UserService } from '../../../services/user-services/user.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
  selector: 'app-assigned-technician-list',
  standalone: true,
  imports: [  CommonModule,
      ReactiveFormsModule,
      NgSelect2Module,
      FormsModule,
      NgxPaginationModule,],
  templateUrl: './assigned-technician-list.component.html',
  styleUrl: './assigned-technician-list.component.scss'
})
export class AssignedTechnicianListComponent implements OnInit {
sessionAgencyID: any;
       assignedTechnicianForm!: FormGroup;
       listPageConfig: any;
     
       pagination = {
         pageNumber: 1,    
         pageSize: 15,
         totalRows: 50,
         totalPages: 0
       };
     
     
       propertySearchControl = new FormControl('');
       isPropertyDropdownOpen = false;
      //  sessionLandlordID: any;
       complainApprovalControls: { [key: string]: FormControl } = {};
       // bulkApprovalControl = new FormControl(false);
       ddlStatus: any[];
     
       constructor(private fb: FormBuilder, private userService: UserService, private tenantComplainService: TenantComplainServiceService,
         public dialog: MatDialog, private tenantService: TenantService, private notifyService: NotifyService,
         private landlordService: LanlordService, private router: Router, private complainService: ComplainService,
         private technicianAssignService: TechnicianAssignService
       ) 
         {
           this.listPageConfig = this.userService.pageConfigInit("list", this.pagination.pageSize, 1, 0);
           this.ddlStatus = this.userService.getDataStatus();
         }
     
       ngOnInit(): void {
         this.getUserLoginData();       
         this.sessionAgencyID = this.userLoginData.agencyID;
        //  this.sessionLandlordID = this.userLoginData.landlordID;  
         this.assignedTechnicianFormInit();
         this.getAssignTechnician(this.pagination.pageNumber);  
         this.loadProperties();     
         this.searchProperty();
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
         
       assignedTechnicianFormInit(){
         this.assignedTechnicianForm = this.fb.group({
           id: new FormControl(0),  
          technicianAssignID: new FormControl(''),
           agencyID: new FormControl(this.sessionAgencyID),
           propertyID: new FormControl(''),
           complainID: new FormControl(''),
           technicianCategoryID: new FormControl(''),
           technicianID: new FormControl(''),
           stateStatus: new FormControl(''),
           billingAmount: new FormControl(0),
           paidAmount: new FormControl(0),
           isActive: new FormControl(''),
           isApproved: new FormControl(''),
           activationStatus: new FormControl(''),
           pageNumber: new FormControl(this.pagination.pageNumber),
           pageSize: new FormControl(this.pagination.pageSize) ,
          //  StateStatus:  new FormControl(''),
          //  flag: new FormControl('AGENCY'),
         });
         this.assignedTechnicianForm.valueChanges.subscribe((value: any) => {
           this.getAssignTechnician(this.pagination.pageNumber);
         });
       }
     
       ddlProperties: any[] = [];
       loadProperties() {
         const propertyID = this.assignedTechnicianForm.controls['propertyID'].value || '';
         const agencyID = this.sessionAgencyID;
         if (!agencyID) {
           console.error("Error: agencyID is not available.");
           return;
         }
         this.tenantService.getPropertiesExtension<any[]>(propertyID, agencyID)
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
         this.assignedTechnicianForm.get('propertyID')?.setValue(item.id);
         this.propertySearchControl.setValue(item.text);
         this.isPropertyDropdownOpen = false; // Close the dropdown 
       }
     
       clearPropertySelection(): void {
         this.assignedTechnicianForm.controls['propertyID'].setValue(''); // Clear propertyID
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
       assignedComplains: any[]=[];
       getAssignTechnician(pageNumber: number)
       {
         let pagination: any;
         const params = { ...this.assignedTechnicianForm.value, pageNumber: pageNumber };   
         this.technicianAssignService.getAssignedTechnician(params).subscribe(
          (response: any) => {    
            //console.log("response ", response);  
            this.assignedComplains = response.body?.data?.list || [];
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

      solve(complainID: any)
      {
       const params = {"complainID":complainID,"agencyID": this.sessionAgencyID
       };
         this.complainService.solve(params).subscribe(
           (response) => {
             console.log("response : ", response)
             if(response?.data?.status){
             this.notifyService.showMessage('success', 'Complain solved');    
             this.getAssignTechnician(this.pagination.pageNumber);
             }
           },
           (error) => {
             console.error('Error :', error);
           }
         );
      }
      

      complete(complainID: any)
      {

      }

      
     
}
