import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';

import { LanlordService } from '../landlord.service';

import { TenantService } from '../../tenant/tenant.service';
import { ComplainService } from '../../complain/complain.service';
import { AddComplainComponent } from './insert-complain/add-complain.component';

import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, map, Observable, of, pipe, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-services/user.service';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';



@Component({
  selector: 'app-complain-list',
  standalone: true,
  imports: [
    CommonModule, // Ensure CommonModule is imported for basic Angular directives
    ReactiveFormsModule, // Required for Reactive Form    
    FormsModule,
    NgxPaginationModule,
    AddComplainComponent
],
  templateUrl: './complain-list.component.html',
  styleUrl: './complain-list.component.scss'
})
export class ComplainListComponent implements OnInit {

        complainFrom!: FormGroup;

        sessionAgencyID: any;
        complainID: any;
        propertySearchControl = new FormControl('');
        isPropertyDropdownOpen = false;
      
        pageNumber: number = 1;
        pageSize: number = 15;
        listPageConfig: any;
         
        entryPage: boolean = false;
        listPage: boolean = true;
        detailsPage: boolean = false;

        serialNumbers: number[][]=[];
        serialNumber: number=1;

        imageUrls: Array<{ [key: number]: string[] }> = [];
      
        @ViewChild('showComplainModal', { static: true }) showComplainModal!: ElementRef;
        ddlStatus: any[];
  
        constructor(private fb: FormBuilder, private notifyService: NotifyService, private landlordService: LanlordService,
          private userService: UserService, private tenantService: TenantService, private complainService: ComplainService,
          private cdr: ChangeDetectorRef, public dialog: MatDialog, private router: Router) 
          {
            this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
            this.ddlStatus = this.userService.getDataStatus();
          }
      
          resetSerialNumber() {
            this.serialNumber = 1;
          }
          
          calculateSerialNumbers() {
            this.serialNumbers = [];  // Reset serial numbers before recalculating
            // console.log("yessss",this.list);
            for (let i = 0; i < (this.list).length; i++) {
              this.serialNumbers[i] = [];
              // console.log("yes")
              
              for (let j = 0; j < this.selectedComplainDetails[i].length;j++) {
                this.serialNumbers[i].push(this.serialNumber++);
                // console.log("yess");
              }
            }
            // console.log("serial",this.serialNumbers);
          }
      
        ngOnInit(): void {
          this.resetSerialNumber();
          this.getUserLoginData();
          this.sessionAgencyID = this.userLoginData.agencyID;     
          this.complainFromInit();
          this.getcomplains().subscribe(
            (list) => {
              this.list = list;
              // this.calculateSerialNumbers();
              console.log("List outside the function:", this.list);
            },
            (error) => {
              console.error("Error fetching list:", error);
            }
          );  
          this.loadProperties();     
          this.searchProperty();
          this.calculateSerialNumbers();
          // let i=0;
          console.log("selectedcomplains", this.selectedComplainDetails);
          console.log("list",this.list);
        }
        // getComplainList()
        // {
        //   // this.getComplainDetail(complain.complainInfoID,index);
        // }
        // getserial()
        // {
        //   return 1;
        // }
        // initializeSerialNumbers() {
        //   let serial = 1;
        //   this.serialNumbers = [];
          
        //   for (let i = 0; i < this.list.length; i++) {
        //     this.serialNumbers[i] = [];
        //     for (let j = 0; j < this.selectedComplainDetails[i].length; j++) {
        //       this.serialNumbers[i].push(serial++);
        //     }
        //   }
        //   console.log(this.selectedComplainDetails);
        // }

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
              isActive: new FormControl(''),
              isApproved: new FormControl(''),
              activationStatus: new FormControl(''),
            })
            // this.complainFrom.valueChanges.subscribe((value: any) => {
            //   this.getcomplains();
            // });
          }

     
          list: any[] = [];
          // complainDetail: any[]=[];
          actualFileNames: any[][][]=[];
          getComplainDetail(complainInfoId: any, i:number)
          {
            let ii = i;
            // console.log("i",i)
            this.complainFrom.get('complainInfoID')?.setValue(complainInfoId);
            const params = this.complainFrom.value;
            this.complainService.getComplainDetails(params).pipe(
              map(response => {
                // console.log("API Response:", response);
          
                // Extract complaints from response body
                const complaints = response?.body?.data;
                if (!Array.isArray(complaints)) {
                  console.error("Invalid API response: expected an array", response);
                  return [];
                }
                this.serialNumbers[ii]=[];
                for (let index = 0; index < complaints.length; index++) {
                  this.serialNumbers[ii].push(this.serialNumber++);
                  console.log(ii,"ii",index);
                }
          
                // Directly assign image files without making extra API calls
                return complaints.map(complaint => ({
                  ...complaint,
                  imageBlobs: complaint.images.map((img: any) => img.file) // Extract image file
                }));
              })
            )
            .subscribe((data: any)=> {
              console.log("ii",ii);
              this.selectedComplainDetails[i] = data;
              this.actualFileNames[i] = [];
              for (let index = 0; index < data.length; index++) {
                this.actualFileNames[i][index]=[];
               for(let j=0;j<data[index].images.length;j++)
               {
                this.actualFileNames[i][index].push(this.selectedComplainDetails[i][index].images[j].actualFileName);
               }
                if (
                  this.selectedComplainDetails[i] &&
                  this.selectedComplainDetails[i][index] &&
                  Array.isArray(this.selectedComplainDetails[i][index].imageBlobs)
                ) {
                  // Ensure this.imageUrls[i] is initialized
                  if (!this.imageUrls[i]) {
                    this.imageUrls[i] = {}; // Initialize as an object
                  }
              
                  this.imageUrls[i][index] = this.selectedComplainDetails[i][index].imageBlobs.map((blobOrBase64: any) => {
                    if (typeof blobOrBase64 === 'string') {
                      // Convert Base64 to Blob
                      const mimeType = 'image/jpeg'; // Adjust as needed
                      const blob = this.base64ToBlob(blobOrBase64, mimeType);
                      return URL.createObjectURL(blob);
                    } else if (blobOrBase64 instanceof Blob) {
                      return URL.createObjectURL(blobOrBase64);
                    } else {
                      console.error('Invalid blob format at index', index);
                      return ''; // Return empty string if it's not a valid blob or base64
                    }
                  });
                }
              }
            }
          );
            // console.log("selectedcomplain",this.selectedComplainDetails);
            // console.log("items",this.selectedComplainDetails);
            // for(let index=0;index<this.selectedComplainDetails.length;index++){
            //   if (this.selectedComplainDetails[index].imageBlobs && this.selectedComplainDetails[index].imageBlobs.length) {
            //     this.imageUrls[index] = this.selectedComplainDetails[index].imageBlobs.map((blob: Blob) => URL.createObjectURL(blob));
            //   }
            // }
            // this.selectedComplainDetails.forEach((complain: any, index: number) => {
            //   if (complain.imageBlobs && complain.imageBlobs.length) {
            //     this.imageUrls[index] = complain.imageBlobs.map((blob: Blob) => URL.createObjectURL(blob));
            //   }
            // });
            // console.log("imageurls",this.imageUrls);
            // console.log("actualfilenames",this.actualFileNames);
            
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
          // getcomplains() {
          //   // console.log("getcomplain");
          //   const params = this.complainFrom.value;
          //   this.complainService.getComplainInfo(params).subscribe(
          //     (response) => {
          //       // console.log("response",response);
          //       this.list = response?.body?.data?.list || [];
          //       // this.afterListUpdate(this.list);
          //       let index=0;
          //       this.list.forEach((complain) => {
          //         this.getComplainDetail(complain.complainInfoID,index);
          //         index++;
          //         if (!this.complainApprovalControls[complain.complainInfoID]) {
          //           this.complainApprovalControls[complain.complainInfoID] = new FormControl(false);
          //         }
          //       });
          //       const pagination = response.headers.get('X-Pagination');
          //       if (pagination) {
          //         this.listPageConfig = JSON.parse(pagination);
          //       }
          //     },
          //     (error) => {
          //       console.error('API Error:', error);
          //     }
          //   );
          // }
        // afterListUpdate(list: any[])
        // {
        //   this.list = list;
        //   console.log(this.list);
        // }
        getcomplains(): Observable<any[]> {
          const params = this.complainFrom.value;
          return this.complainService.getComplainInfo(params).pipe(
            map((response) => {
              const list = response?.body?.data?.list || [];
              for(let index=0;index<list.length;index++){
                console.log("index",index);
                this.getComplainDetail(list[index].complainInfoID, index);
              }
              list.forEach((complain:any) => {
                if (!this.complainApprovalControls[complain.complainInfoID]) {
                  this.complainApprovalControls[complain.complainInfoID] = new FormControl(false);
                }
              });
        
              const pagination = response.headers.get('X-Pagination');
              if (pagination) {
                this.listPageConfig = JSON.parse(pagination);
              }
        
              return list;
            })
          );
        }
   
        listPageInit() {
          this.getUserLoginData();
          this.entryPage = false;
          this.listPage = true;
          this.detailsPage = false; 
          this.complainFromInit();
          this.loadProperties();
          this.getcomplains();
        }
        
        fnBackToList(event: any) {
          this.entryPage = false;
          this.listPage = true;
          this.detailsPage = false;
        }
        
        createcomplain() {
          this.listPage = false;
          this.entryPage = true;
        }
        
      
      listPageChanged(event: any) {
        this.pageNumber = event;
        this.complainFrom.get('pageNumber')?.setValue(this.pageNumber);
        this.getcomplains();
      }
    
    
      expandedRows: { [key: string]: boolean } = {};
      // selectedComplainDetails: { [key: string]: any[] } = {};
      
      selectedComplainDetails: any[]=[];
    
      complainToggleDetails(complainInfoID: string, index:number) {
        this.expandedRows[complainInfoID] = !this.expandedRows[complainInfoID];
        // if(!this.expandedRows[complainInfoID])
        // {
        //   this.imageUrls = {};
        // }
        // else
        // {
        //   this.getComplainDetail(complainInfoID)
        // }
        
        // Load details only if expanding
        // if (this.expandedRows[complainInfoID] && !this.selectedComplainDetails[complainInfoID]) {
          this.getComplainDetail(complainInfoID,index);
          // console.log("imageurls",this.imageUrls);
          // console.log("selectedcomplaindetails",this.selectedComplainDetails);
          // console.log("selectedcomplains", this.selectedComplains);
        // }
      }  
          
      // loadComplainsDetails(complainInfoID: any): void {
      //   let params = {complainInfoID: complainInfoID, agencyID: this.sessionAgencyID}
      //   // console.log(params);
      //   this.complainService.loadComplainDetails(params).subscribe(
      //     (response) => {
      //       // console.log('API Response:', response);
      //       if (response.body?.data) {
      //         this.selectedComplainDetails[complainInfoID] = response.body.data;
      //       } 
      //       else {        
      //         this.notifyService.showMessage('warning', `No data received for property.`);
      //         this.selectedComplainDetails[complainInfoID] = []; 
      //       }
      //     },
      //     (error) => {
      //       console.error('Error fetching property details:', error);
      //     }
      //   );
      // }

       //-----------------------------------------------Start Bulk Approval----------------------------------------------

      bulkApprovalControl = new FormControl(false); // For bulk checkbox
      complainApprovalControls: { [key: string]: FormControl } = {}; // Individual checkboxes
      selectedComplains: Set<string> = new Set(); // Track selected complaints
      _selectComplainStatus: any;
      _landlordID: any;
      btnAllApproval: boolean = false;
      
      toggleAllSelections() {
        const isBulkSelected = this.bulkApprovalControl.value;
        this.list.forEach((complain: any) => { 
          this.btnAllApproval = true;
          this._selectComplainStatus = complain.stateStatus;  
          this._landlordID = complain.landlordID;  
          if (complain.stateStatus === 'Pending') {
            this.complainApprovalControls[complain.complainInfoID].setValue(isBulkSelected);
            if (isBulkSelected) {
              this.selectedComplains.add(complain.complainInfoID);
            } else {
              this.selectedComplains.delete(complain.complainInfoID);
            }
          }
        });
      }
      
      toggleIndividualSelection(complainInfoID: string) {
        this.list.forEach((complain: any) => { 
          this._landlordID = complain.landlordID;  
        });

        const isSelected = this.complainApprovalControls[complainInfoID].value;       
        if (isSelected) {                 
          this.selectedComplains.add(complainInfoID);
        } else {
          this.selectedComplains.delete(complainInfoID);
        }
        this.bulkApprovalControl.setValue(
          this.list.every(
            (complain) =>
              this.complainApprovalControls[complain.complainInfoID].value ||
              complain.stateStatus !== 'Pending'
          )
        );
      }

    bulkApproveSelected() {
        const selectedIds = Array.from(this.selectedComplains);
        // console.log("selectedIds ", selectedIds);
        if (selectedIds.length === 0) {
          this.notifyService.showMessage('warning', 'No complaints selected for approval.');
          return;
        }
        const payload = {
          complainApprovalInfo: {
            complainInfoID: null, // This should be null because we are using `complainApprovalDetails`.
            flag: 'Bulk_Approval',
            landlordID: this._landlordID,
            agencyID: this.sessionAgencyID,
            stateStatus: 'Approved',
          },
          complainApprovalDetails: selectedIds.map((id) => ({
            complainInfoID: id,
            stateStatus: 'Approved', // Assuming this status applies to all.
          })),
        };
        // console.log("_landlordID ", this._landlordID);
        // console.log("payload ", payload);

       this.landlordService.approval(payload).subscribe(
        (response) => {
          // console.log("response : ", response)
          if (response?.data?.status) {
            this.notifyService.showMessage('success', 'All selected complaints approved successfully.');
            this.bulkApprovalControl = new FormControl(false); 
            this.btnAllApproval = false;

            selectedIds.forEach((id) => {
              this.complainApprovalControls[id].setValue(false); // Uncheck individual checkboxes
            });
    

            this.getcomplains();
          }
        },
        (error) => {
          console.error('Error approving complaints:', error);
          this.notifyService.showMessage('error', 'Failed to approve complaints.');
        }
      );
    }
      
       
    selectedApprove(complainInfoID: any, landlordID: any){
      if (complainInfoID.length === 0) {
        this.notifyService.showMessage('warning', 'No complaints selected for approval.');
        return;
      }
      const selectedIds = Array.from(this.selectedComplains);
      // console.log("complainInfoID ", complainInfoID);
      // console.log("this.landlordID ", landlordID);
      const payload = {
        complainApprovalInfo: {
          complainInfoID: complainInfoID, // This should be null because we are using `complainApprovalDetails`.
          flag: 'Selected_Approval',
          landlordID: landlordID,
          agencyID: this.sessionAgencyID,
          stateStatus: 'Approved',
        },
        complainApprovalDetails: selectedIds.map((id) => ({
          complainInfoID: id,
          stateStatus: 'Approved', // Assuming this status applies to all.
        })),
      };
      // console.log("payload ", payload);
   
    
      this.landlordService.approval(payload).subscribe(
        (response) => {
          // console.log("response : ", response)
          if(response?.data?.status){
          this.notifyService.showMessage('success', 'Selected complaints approved successfully.');
          this.complainApprovalControls[complainInfoID].setValue(false);
          this.bulkApprovalControl = new FormControl(false); 
          this.btnAllApproval = false;
          this.getcomplains();
          }
        },
        (error) => {
          console.error('Error approving complaints:', error);
        }
      );
    }
      
    openModal(imgSrc: string): void {
        this.dialog.open(ImageModalComponent, {
          width: '350px',
          disableClose: false,
          data: { imageUrl: imgSrc }
        });
      }
      
      navigateToEditComplain(selectedComplain: any, imageurls: any, complaininfoindex:any, complainindex:any) {
        this.router.navigate(['/edit-complain'],{ state: { complaintData: selectedComplain,images: imageurls,actualFileNames:this.actualFileNames,complaininfoindex: complaininfoindex,complainindex: complainindex} });
      }

      // ngOnDestroy() {
      //   for(let i=0;i<this.imageUrls.length;i++){
      //   Object.values(this.imageUrls[i]).flat().forEach(url => URL.revokeObjectURL(url));
      //   }
      // }
}
