import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { TenantComplainServiceService } from '../../tenant/complain/tenant-complain-service.service';
import { MatDialog } from '@angular/material/dialog';
import { TenantService } from '../../tenant/tenant.service';

import { LanlordService } from '../landlord.service';
import { map } from 'rxjs';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../../services/user-services/user.service';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MatPaginatorModule],
  templateUrl: './landlord-dashboard.component.html',
  styleUrl: './landlord-dashboard.component.scss'
})

export class LandlordDashboardComponent implements OnInit{  
  sessionAgencyID: any;
  complainFrom!: FormGroup;
  listPageConfig: any;

  pagination = {
    pageNumber: 1,    
    pageSize: 15,
    totalRows: 50,
    totalPages: 0
  };

  imageUrls: { [key: number]: string[] } = {};

  propertySearchControl = new FormControl('');
  isPropertyDropdownOpen = false;
  sessionLandlordID: any;
  complainApprovalControls: { [key: string]: FormControl } = {};
  // bulkApprovalControl = new FormControl(false); 

  @ViewChild('showComplainModal', { static: true }) showComplainModal!: ElementRef;
  ddlStatus: any[];

  selectedTab: number = 0;

  constructor(private fb: FormBuilder, private userService: UserService, private tenantComplainService: TenantComplainServiceService,
    public dialog: MatDialog, private tenantService: TenantService, private notifyService: NotifyService,
    private landlordService: LanlordService
  ) 
    {
      this.listPageConfig = this.userService.pageConfigInit("list", this.pagination.pageSize, 1, 0);
      this.ddlStatus = this.userService.getDataStatus();
    }

  ngOnInit(): void {
    this.getUserLoginData();       
    this.sessionAgencyID = this.userLoginData.agencyID;
    this.sessionLandlordID = this.userLoginData.landlordID;        
    this.complainFromInit();
    this.getComplains(this.pagination.pageNumber, this.complainFrom.get('searchString')?.value);  
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
      landlordID: new FormControl(this.sessionLandlordID),
      segmentID: new FormControl(''),
      complainID: new FormControl(''),
      complainName: new FormControl(''),  
      description: new FormControl(''),
      stateStatus: new FormControl(''),
      isActive: new FormControl(true),
      isApproved: new FormControl(null),
      activationStatus: new FormControl(''),
      comments: new FormControl(''),
      searchString: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pagination.pageNumber),
      pageSize: new FormControl(this.pagination.pageSize) ,
      flag: new FormControl('LANDLORD'),
    });
    this.complainFrom.valueChanges.subscribe((value: any) => {
      this.getComplains(this.pagination.pageNumber, this.complainFrom.get('searchString')?.value);
    });
  }

  complains: any[]=[];
  actualFileNames: any[][]=[];
  isApproved:boolean = false;
  isSolved:boolean = false;
  isRejected:boolean = false;
  isSentToLandlord:boolean = false;
  isAssignedTechnician:boolean = false;
  isCompleted:boolean = false;

  getComplains(pageNumber: number, search: any)
  {
     
    let flag; 

    if(this.selectedTab === 0){
      flag = 'Pending';
      this.isApproved = false;
      this.isSentToLandlord=true;

      this.isRejected=false
    }

    else if(this.selectedTab === 1){   
      this.isRejected=true;
      
      this.isApproved=false;
      this.isSolved=false;
      this.isSentToLandlord=false;
      this.isAssignedTechnician=false;
      this.isCompleted=false;
    }

    else if(this.selectedTab === 2){
      flag = 'Approved';
      this.isApproved = true;
      
      this.isRejected=false;
      this.isSolved=false;
      this.isSentToLandlord=false;
      this.isAssignedTechnician=false;
      this.isCompleted=false;
    }
   
    else if(this.selectedTab === 3){
      this.isSolved=true;
      this.isApproved=true;

      this.isRejected=false;     
      this.isSentToLandlord=false;
      this.isAssignedTechnician=false;
      this.isCompleted=false;
    } 
    else if(this.selectedTab === 4){      
      this.isCompleted=true;

      this.isApproved=true;
      this.isRejected=false;   
      this.isAssignedTechnician=true;
      this.isCompleted=true;
    }
    else if(this.selectedTab === 5){
      this.isAssignedTechnician=true;
      this.isApproved=true;

      this.isSentToLandlord=false;   
      this.isRejected=false; 
      this.isCompleted=false;
    }
    else if(this.selectedTab === 6){
      this.isAssignedTechnician=true;
      this.isSentToLandlord=false;
      this.isApproved=true;
      this.isRejected=false; 
      this.isCompleted=true;
    }

    let pagination: any;
    const params = { ...this.complainFrom.value, pageNumber: pageNumber , stateStatus: flag ?? '', searchString: search ?? '', isApproved: this.isApproved, isSolved: this.isSolved, 
      isRejected: this.isRejected, isSentToLandlord: this.isSentToLandlord, isAssignedTechnician: this.isAssignedTechnician, isCompleted: this.isCompleted };   

    this.tenantComplainService.getComplainInfo(params).pipe(
      map(response => {   
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

      this.pagination = {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalRows: pagination.totalRows
      };       

    }
  );
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
  this.getComplains(this.pagination.pageNumber, this.complainFrom.get('searchString')?.value);  
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


selectedApprove(complainID: any, complainInfoID: any, status: string, comments: any){
  const selectedIds = Array.from(this.selectedComplains);

  const payload = {
    flag: 'Selected_Approval',
    complainsToApprove: [
      {
        complainID: complainID,  
        complainInfoID: complainInfoID,
        landlordID: this.sessionLandlordID,
        agencyID: this.sessionAgencyID,
        stateStatus: status === 'approve' ? 'Approved' : 'Rejected',
        comments: comments
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
      this.getComplains(this.pagination.pageNumber, this.complainFrom.get('searchString')?.value);

      }
    },
    (error) => {
      console.error('Error approving complaints:', error);
    }
  );
}

selectTab(tabIndex: number) {
  this.selectedTab = tabIndex;       
  this.getComplains(this.pagination.pageNumber, this.complainFrom.get('searchString')?.value);
}


}



