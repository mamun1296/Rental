import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

import { SegmentService } from '../segment.service';
import { AddSegmentComponent } from '../insert-update/add-segment.component';
import { PropertyService } from '../../property/property.service';

import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../../../services/modal-services/modal.service';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { UserService } from '../../../services/user-services/user.service';

@Component({
  selector: 'app-segment',
  standalone: true,
  imports: [
    CommonModule, // Ensure CommonModule is imported for basic Angular directives
    ReactiveFormsModule, // Required for Reactive Forms
    NgSelect2Module, // Import NgSelect2Module here,
    FormsModule,
    AddSegmentComponent,
    NgxPaginationModule
  ],
  providers:[
    ModalService
  ],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})
export class SegmentComponent implements OnInit{
  
    segmentForm!: FormGroup;
    sessionAgencyID: any;
    landlordID: any;
    _landlordID: any;
    _propertyID: any;
    _segmentID: any;
    
    landlordSearchControl = new FormControl('');
    propertySearchControl = new FormControl('');
    segmentSearchControl = new FormControl('');
    isLandlordDropdownOpen = false; 
    isPropertyDropdownOpen = false; 
    isSegmentDropdownOpen = false; 
  
    entryPage: boolean = false;
    listPage: boolean = true;
    detailsPage: boolean = false;
    pageNumber: number = 1;
    pageSize: number = 15;
    listPageConfig: any;

    @ViewChild('showAddPropertiesModal', { static: true }) showAddPropertiesModal!: ElementRef;
  
    constructor(private fb: FormBuilder, private segmentService: SegmentService, private notifyService: NotifyService, private modalService: ModalService, 
      private propertyService: PropertyService,  public userService: UserService) 
      {
        this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
    }
  
    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.segmentFormInit();
      this.getSegmentWiseItems();  
      this.loadLandlords();
      this.searchLandlord();
      this.searchProperty();
      this.searchSegment();
    }
      
              
       //........................................................load Landlords................................................
       //..........................................................................................

        ddlLandlords: any[] = [];
        loadLandlords() {
          const landlordID = this.segmentForm.controls['landlordID'].value || '';           
          const agencyID = this.sessionAgencyID;
          if (!agencyID) {
            console.error("Error: agencyID is not available.");
            return;
          }
          this.propertyService.getLandlordsExtension<any[]>(landlordID, agencyID)
            .then((response: any) => {
              const resData = response.data || [];
              this.ddlLandlords = resData.map((landlord: any) => ({
                id: landlord.id.toString(),
                text: landlord.text,
              }));  
              this.filteredLandlords = this.ddlLandlords;            
            })
            .catch((error: any) => {
              console.error("Error fetching landlords:", error);
            });
        }

        landlordToggleDropdown(): void {
          this.isLandlordDropdownOpen = !this.isLandlordDropdownOpen;
        }
      
        selectLandlord(item: { id: string; text: string }): void {
          this.segmentForm.get('landlordID')?.setValue(item.id); // Set landlord ID
          this.segmentForm.get('landlordName')?.setValue(item.text);
          this._landlordID = item.id;

          this.loadProperties(item.id);
          this.landlordSearchControl.setValue(item.text);
          this.isLandlordDropdownOpen = false; // Close the dropdown 
        }

        clearLandlordSelection(): void {
          this.segmentForm.controls['landlordID'].setValue(''); // Clear landlordID
          this.segmentForm.controls['propertyID'].setValue('');
          this.segmentForm.controls['segmentID'].setValue('');
        
          this.landlordSearchControl.setValue(''); // Clear searchControl
          this.isLandlordDropdownOpen = false; // Optionally close the dropdown  

          this.filteredLandlords = this.ddlLandlords;
          this.filteredProperty = [];
          this.filteredSegment = [];
          this._landlordID = '';
          this._propertyID = '';
          this._segmentID = '';  
        }
      

        searchLandlord() {
        this.landlordSearchControl.valueChanges.subscribe((value: any) => {
          this.filterLandlord(value);
        });
        } 
        
        filteredLandlords: any[] = [];
        filterLandlord(value: string): void {
        const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
        this.filteredLandlords = this.ddlLandlords.filter((landlord) =>
          landlord.id.toLowerCase().includes(filterValue) || 
          landlord.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
        );
       }


      
       //........................................................load Properties................................................
       //..........................................................................................

       ddlProperties: any[] = [];
       loadProperties(landlordID: any): void {       
       const property_id =  this.segmentForm.get('propertyID')?.value || '';   
       const agency_id = this.sessionAgencyID;   
    
       if (!agency_id) {
         console.error("Error: AgencyID is not available.");
         return;
       }    
       this.segmentService.getPropertiesExtension<any[]>(property_id, agency_id, landlordID)
         .then((response: any) => {
           const resData = response.data || [];
           this.ddlProperties = resData.map((property: any) => ({
             id: property.id.toString(),
             text: property.text,
           }));   
           
           this.filteredProperty = this.ddlProperties;    
         })
         .catch((error: any) => {
           console.error("Error fetching property:", error);
         });
       }

       propertyToggleDropdown(): void {
        this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      }
    
      selectProperty(item: { id: string; text: string }): void {
        this.segmentForm.get('propertyID')?.setValue(item.id);
        this.segmentForm.get('propertyName')?.setValue(item.text);

        this.loadSegments(item.id, this._landlordID);

        this.propertySearchControl.setValue(item.text);
        this.isPropertyDropdownOpen = false; // Close the dropdown 

        this._propertyID = item.id;
     
      }

      clearPropertySelection(): void {
        this.segmentForm.controls['propertyID'].setValue('');
        this.segmentForm.controls['segmentID'].setValue('');
      
        this.propertySearchControl.setValue(''); // Clear searchControl
        this.isPropertyDropdownOpen = false; // Optionally close the dropdown      
        this.filteredProperty = this.ddlProperties;
        this.filteredSegment = [];
        this._propertyID = '';
        this._segmentID = '';

      }
    

      searchProperty() {
      this.propertySearchControl.valueChanges.subscribe((value: any) => {
        this.filterProperty(value);
      });
      } 
      
      filteredProperty: any[] = [];
      filterProperty(value: string): void {
      const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
      this.filteredProperty = this.ddlProperties.filter((property) =>
        property.id.toLowerCase().includes(filterValue) || 
        property.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
      );
     }

      //...............................................load Segments................................................
      //....................................................................................................

       ddlSegments: any[] = [];
       loadSegments(propertyID: any, landlordID: any): void {       
       const segment_id = this.segmentForm.get('segmentID')?.value || '';   
       const agency_id = this.sessionAgencyID;   
    
       if (!agency_id) {
         console.error("Error: AgencyID is not available.");
         return;
       }    
       this.segmentService.getSegmentsExtension<any[]>(segment_id, agency_id, landlordID, propertyID)
         .then((response: any) => {
           const resData = response.data || [];
           this.ddlSegments = resData.map((segment: any) => ({
             id: segment.id.toString(),
             text: segment.text,
           }));   
           
           this.filteredSegment = this.ddlSegments;    
         })
         .catch((error: any) => {
           console.error("Error fetching segment:", error);
         });
       }

       segmentToggleDropdown(): void {
        this.isSegmentDropdownOpen = !this.isSegmentDropdownOpen;
      }
    
      selectSegment(item: { id: string; text: string }): void {
        this.segmentForm.get('segmentID')?.setValue(item.id);
        this.segmentForm.get('segmentName')?.setValue(item.text);   
        this.segmentSearchControl.setValue(item.text);
        this.isSegmentDropdownOpen = false;
   
        this._segmentID = item.id;
      }

      clearSegmentSelection(): void {
        this.segmentForm.controls['segmentID'].setValue('');
        this.segmentForm.controls['segmentName'].setValue('');
      
        this.segmentSearchControl.setValue('');
        this.isSegmentDropdownOpen = false;  
        this.filteredSegment = this.ddlSegments;     
        this._segmentID = '';    

      }
    

      searchSegment() {
      this.segmentSearchControl.valueChanges.subscribe((value: any) => {
        this.filterSegment(value);
      });
      }
      
      filteredSegment: any[] = [];
      filterSegment(value: string): void {
      const filterValue = value.toLowerCase();
      this.filteredSegment = this.ddlSegments.filter((segment) =>
        segment.id.toLowerCase().includes(filterValue) || 
        segment.text.toLowerCase().includes(filterValue)
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
    
      segmentFormInit(){
        this.segmentForm = this.fb.group({
          id: new FormControl(0),
          segmentWiseItemID: new FormControl(''),
          agencyID: new FormControl(this.sessionAgencyID),
          landlordID: new FormControl('', [Validators.required, Validators.minLength(3)]),
          landlordName: new FormControl(''),
          propertyID: new FormControl('', [Validators.required, Validators.minLength(3)]),    
          propertyName: new FormControl(''),
          segmentID: new FormControl('', [Validators.required, Validators.minLength(3)]),      
          segmentName: new FormControl(''),       
          isActive: new FormControl(true),
          isApproved: new FormControl(true),
          stateStatus: new FormControl('Approved'),
        })    
        
        this.segmentForm.valueChanges.subscribe((value: any) => {
          this.getSegmentWiseItems();
        });
      }
      
    

    
      list: any[] = [];
      getSegmentWiseItems() {
        const params = this.segmentForm.value;   
        this.segmentService.getSegmentWiseItems(params).subscribe(
          (response) => {      
            this.list = response.body?.data?.list || [];
            const pagination = response.headers.get('X-Pagination');
            if (pagination) {
              // console.log('Pagination:',  pagination);
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
        this.segmentFormInit();
        this.loadLandlords();
        this.getSegmentWiseItems();
      }
    
    
      fnBackToList(event: any) {
        this.entryPage = false;
        this.listPage = true;
        this.detailsPage = false;
      }
    
    
      createProperty() {
        this.listPage = false;
        this.entryPage = true;
      }
    
  
      listPageChanged(event: any) {
        this.pageNumber = event;
        this.segmentForm.get('pageNumber')?.setValue(this.pageNumber);
        this.getSegmentWiseItems();
      }
  
  
  
    expandedRows: { [key: string]: boolean } = {};
    selectedSegmentDetails: { [key: string]: any[] } = {};
  
    segmentToggleDetails(segmentWiseItemID: string) {
      this.expandedRows[segmentWiseItemID] = !this.expandedRows[segmentWiseItemID];
      
      // Load details only if expanding
      if (this.expandedRows[segmentWiseItemID] && !this.selectedSegmentDetails[segmentWiseItemID]) {
        this.loadSegmentWiseItemsDetails(segmentWiseItemID);
      }
    }  
    
    
    loadSegmentWiseItemsDetails(segmentWiseItemID: any): void {
      this.segmentService.loadSegmentWiseItemsDetails(segmentWiseItemID, this.sessionAgencyID).subscribe(
        (response) => {
         // console.log('API Response:', response);
          if (response.body?.data) {
            this.selectedSegmentDetails[segmentWiseItemID] = response.body.data;
          } 
          else {        
            this.notifyService.showMessage('warning', `No data received for segment.`);
            this.selectedSegmentDetails[segmentWiseItemID] = []; // Set to an empty array to prevent undefined errors
          }
        },
        (error) => {
          console.error('Error fetching segment details:', error);
        }
      );
    }
    
  
    
  
  
}
