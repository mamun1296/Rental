import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { ComplainService } from '../complain.service';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TenantService } from '../../tenant/tenant.service';
import { LanlordService } from '../../landlord/landlord.service';
import { MatDialog } from '@angular/material/dialog';
import { TenantComplainServiceService } from '../../tenant/complain/tenant-complain-service.service';
import { map } from 'rxjs';

import { Router } from '@angular/router';
import { UserService } from '../../../services/user-services/user.service';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';


@Component({
  selector: 'app-complain',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelect2Module,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './complain.component.html',
  styleUrl: './complain.component.scss'
})
export class ComplainComponent implements OnInit{
     sessionAgencyID: any;
    complainFrom!: FormGroup;
    listPageConfig: any;
    regType: any;

    pagination = {
      pageNumber: 1,    
      pageSize: 15,
      totalRows: 50,
      totalPages: 0
    };
  
    imageUrls: { [key: number]: string[] } = {};
  
       propertySearchControl = new FormControl('');
       isPropertyDropdownOpen = false;
      //  sessionLandlordID: any;
       complainApprovalControls: { [key: string]: FormControl } = {};
       // bulkApprovalControl = new FormControl(false); 
     
       @ViewChild('showComplainModal', { static: true }) showComplainModal!: ElementRef;
       ddlStatus: any[];
     
       constructor(private fb: FormBuilder, private userService: UserService, private tenantComplainService: TenantComplainServiceService,
         public dialog: MatDialog, private tenantService: TenantService, private notifyService: NotifyService,
         private landlordService: LanlordService, private router: Router, private complainService: ComplainService
       ) 
         {
           this.listPageConfig = this.userService.pageConfigInit("list", this.pagination.pageSize, 1, 0);
           this.ddlStatus = this.userService.getDataStatus();
         }
     
       ngOnInit(): void {
         this.getUserLoginData();       
         this.sessionAgencyID = this.userLoginData.agencyID;   
         this.regType = this.userLoginData.registrationType;       
         this.complainFromInit();
         this.getComplains(this.pagination.pageNumber);  
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
         
       complainFromInit(){
         this.complainFrom = this.fb.group({
           id: new FormControl(0),  
           complainInfoID: new FormControl(''),
           agencyID: new FormControl(this.sessionAgencyID),
           propertyID: new FormControl(''),
           landlordID: new FormControl(''),
           segmentID: new FormControl(''),
           complainID: new FormControl(''),
           complainName: new FormControl(''),  
           description: new FormControl(''),
           stateStatus: new FormControl(''),
           isActive: new FormControl(true),
           isApproved: new FormControl(false),
           activationStatus: new FormControl('Active'),
           comments: new FormControl(''),
           searchString: new FormControl(''),       
           pageNumber: new FormControl(this.pagination.pageNumber),
           pageSize: new FormControl(this.pagination.pageSize),
           flag: new FormControl('AGENCY')
         });
         this.complainFrom.valueChanges.subscribe((value: any) => {
           this.getComplains(this.pagination.pageNumber);
         });
       }
     
       ddlProperties: any[] = [];
       loadProperties() {
         const propertyID = this.complainFrom.controls['propertyID'].value || '';
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
         this.complainFrom.get('propertyID')?.setValue(item.id);
         this.propertySearchControl.setValue(item.text);
         this.isPropertyDropdownOpen = false; // Close the dropdown 
       }
     
       clearPropertySelection(): void {
         this.complainFrom.controls['propertyID'].setValue(''); // Clear propertyID
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
       complains: any[]=[];
       actualFileNames: any[][]=[];
       getComplains(pageNumber: number)
       {
         let pagination: any;      
      
         const params = { ...this.complainFrom.value, pageNumber: pageNumber };   
         if(this.regType == "Agency"){
          this.tenantComplainService.getComplainInfoForAgency(params).pipe(
            map((response: any) => {   
              if (!response?.body?.data) {
                return { complains: [], pagination: null };
              }     
        
              const complains = response.body.data.list || [];
              pagination = response.body.data.pagination;
              
              if (!Array.isArray(complains)) { 
                return [];
              }
              complains.forEach((complain:any) => {
                if (!this.complainApprovalControls[complain.complainID]) {
                  this.complainApprovalControls[complain.complainID] = new FormControl(false);
                }
              });
              return complains.map(complain => ({
                ...complain, pagination,
                imageBlobs: complain.images.map((img: any) => img.file) // Extract image file
              }));
            })
          )
          .subscribe((data: any)=> {
            this.complains = data;   
            for (let index = 0; index < this.complains.length; index++) {
              this.actualFileNames[index]=[];
              for(let j=0;j < this.complains[index].images.length;j++)
                {
                 this.actualFileNames[index].push(this.complains[index].images[j].actualFileName);
                }
              if (
                this.complains &&
                this.complains[index] &&
                Array.isArray(this.complains[index].imageBlobs)
              ) {
                if (!this.imageUrls) {
                  this.imageUrls = {};
                }
            
                this.imageUrls[index] = this.complains[index].imageBlobs.map((blobOrBase64: any) => {
                  if (typeof blobOrBase64 === 'string') {
                    const mimeType = 'image/jpeg';
                    const blob = this.base64ToBlob(blobOrBase64, mimeType);
                    return URL.createObjectURL(blob);
                  } else if (blobOrBase64 instanceof Blob) {
                    return URL.createObjectURL(blobOrBase64);
                  } else {
                    console.error('Invalid blob format at index', index);
                    return ''; 
                  }
                });
              }
            }
            // console.log("imageurls",this.imageUrls);    
            this.pagination = {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
              totalPages: pagination.totalPages,
              totalRows: pagination.totalRows
            };      
      
          }
         );
        }
        else{

          this.tenantComplainService.getComplainInfo(params).pipe(
            map((response: any) => {   
              if (!response?.body?.data) {
                return { complains: [], pagination: null };
              }     
        
              const complains = response.body.data.list || [];
              pagination = response.body.data.pagination;
              
              if (!Array.isArray(complains)) { 
                return [];
              }
              complains.forEach((complain:any) => {
                if (!this.complainApprovalControls[complain.complainID]) {
                  this.complainApprovalControls[complain.complainID] = new FormControl(false);
                }
              });
              return complains.map(complain => ({
                ...complain, pagination,
                imageBlobs: complain.images.map((img: any) => img.file) // Extract image file
              }));
            })
          )
          .subscribe((data: any)=> {
            this.complains = data;   
            for (let index = 0; index < this.complains.length; index++) {
              this.actualFileNames[index]=[];
              for(let j=0;j < this.complains[index].images.length;j++)
                {
                 this.actualFileNames[index].push(this.complains[index].images[j].actualFileName);
                }
              if (
                this.complains &&
                this.complains[index] &&
                Array.isArray(this.complains[index].imageBlobs)
              ) {
                if (!this.imageUrls) {
                  this.imageUrls = {};
                }
            
                this.imageUrls[index] = this.complains[index].imageBlobs.map((blobOrBase64: any) => {
                  if (typeof blobOrBase64 === 'string') {
                    const mimeType = 'image/jpeg';
                    const blob = this.base64ToBlob(blobOrBase64, mimeType);
                    return URL.createObjectURL(blob);
                  } else if (blobOrBase64 instanceof Blob) {
                    return URL.createObjectURL(blobOrBase64);
                  } else {
                    console.error('Invalid blob format at index', index);
                    return ''; 
                  }
                });
              }
            }
            // console.log("imageurls",this.imageUrls);    
            this.pagination = {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
              totalPages: pagination.totalPages,
              totalRows: pagination.totalRows
            };      
      
          }
        );

        }
         
       // console.log(this.complainFrom);  
       }
     
       base64ToBlob(base64: string, mimeType: string): Blob {
         const byteCharacters = atob(base64);
         const byteArrays = [];
         
         for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
           const slice = byteCharacters.slice(offset, offset + 1024);
           const byteNumbers = new Array(slice.length);
           
           for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
           }
           
           byteArrays.push(new Uint8Array(byteNumbers));
         }
         
         return new Blob(byteArrays, { type: mimeType });
       }
       openModal(imgSrc: string): void {
         this.dialog.open(ImageModalComponent, {
           width: '350px',
           disableClose: false,
           data: { imageUrl: imgSrc }
         });
       }
     
     listPageChanged(event: number) {
       this.pagination.pageNumber = event;     
       this.getComplains(this.pagination.pageNumber);  
     }
     
     
     _landlordID: any;
     selectedComplains: Set<string> = new Set();
     
     // toggleIndividualSelection(complainID: string) {
     //   const isSelected = this.complainApprovalControls[complainID].value;       
     //   if (isSelected) {                 
     //     this.selectedComplains.add(complainID);
     //   } else {
     //     this.selectedComplains.delete(complainID);
     //   }
     //   this.bulkApprovalControl.setValue(
     //     this.complains.every(
     //       (complain) =>
     //         this.complainApprovalControls[complain.complainID].value ||
     //         complain.stateStatus !== 'Pending'
     //     )
     //   );
     // }
     // btnAllApproval: boolean = false;
     
     selectedApprove(complainID: any, complainInfoID: any, landlordID:any){
       const selectedIds = Array.from(this.selectedComplains);
     
       const payload = {
         flag: 'Selected_Approval',
         complainsToApprove: [
           {
             complainID: complainID,  
             complainInfoID: complainInfoID,
             landlordID: landlordID,
             agencyID: this.sessionAgencyID,
             stateStatus: 'Approved',
           }
         ]
       };
     
       this.landlordService.approval(payload).subscribe(
         (response) => {       
           if(response?.data?.status){
           this.notifyService.showMessage('success', 'Selected complaints approved successfully.');
           this.complainApprovalControls[complainID].setValue(false);
           // this.bulkApprovalControl = new FormControl(false); 
           // this.btnAllApproval = false;
           this.getComplains(this.pagination.pageNumber);
           }
         },
         (error) => {
           console.error('Error approving complaints:', error);
         }
       );
     }
     sentToLandlord(complainID: any, complainInfoID: any)
     {
      const params = {"complainID":complainID};
        this.complainService.sendToLandlord(params).subscribe(
          (response) => {
            console.log("response : ", response)
            if(response?.data?.status){
            this.notifyService.showMessage('success', 'complain sent to landlord successfully');
            // this.complainApprovalControls[complainID].setValue(false);
            // this.bulkApprovalControl = new FormControl(false); 
            // this.btnAllApproval = false;
            this.getComplains(this.pagination.pageNumber);
            }
          },
          (error) => {
            console.error('Error :', error);
          }
        );
     }
     assignTechnician(complain: any)
     {
      this.router.navigate(['/assign-technician'], { queryParams: complain });
     }


     solve(complainID: any)
      {
       const params = {"complainID":complainID,"agencyID": this.sessionAgencyID
       };
         this.complainService.solve(params).subscribe(
           (response) => {
             console.log("response : ", response)
             if(response.statusCode==200){
             this.notifyService.showMessage('success', 'Complain solved');
             // this.complainApprovalControls[complainID].setValue(false);
             // this.bulkApprovalControl = new FormControl(false); 
             // this.btnAllApproval = false;
            //  this.assignedTechnicianFormInit();
             this.getComplains(this.pagination.pageNumber);
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
