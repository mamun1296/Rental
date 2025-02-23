import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../property.service';

import { CommonModule } from '@angular/common';
import { NotifyService } from '../../../services/notify-services/notify.service';
declare var bootstrap: any;

@Component({
  selector: 'app-add-property-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-property-modal.component.html',
  styleUrl: './add-property-modal.component.scss'
})
export class AddPropertyModalComponent implements OnInit{  
  @Output() childToParent = new EventEmitter<any>();
  segmentsFormArray: FormArray;

  constructor(private fb: FormBuilder, private propertyService: PropertyService, private notifyService: NotifyService){   
    this.segmentsFormArray = this.fb.array([this.createSegment()]); 
  }

      propertyEntryForm!: FormGroup;
      sessionAgencyID: any;
      landlordID: any;
      searchControl = new FormControl('');
      isDropdownOpen = false; 



      ngOnInit(): void {
        this.getUserLoginData();
        this.sessionAgencyID = this.userLoginData.agencyID;     
        this.propertyFormInit();
        this.getProperties();  
        this.loadLandlords();     
        this.loadsegments();
        this.searchLandlord();
      }
      
        ddlLandlords: any[] = [];
        loadLandlords() {
          const landlordID = this.propertyEntryForm.controls['landlordID'].value || '';
          const agencyID = this.sessionAgencyID;
          if (!agencyID) {
            console.error("Error: agencyID is not available.");
            return;
          }
          this.propertyService
            .getLandlordsExtension<any[]>(landlordID, agencyID)
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

        toggleDropdown(): void {
          this.isDropdownOpen = !this.isDropdownOpen;
        }
      
        selectLandlord(item: { id: string; text: string }): void {
          this.propertyEntryForm.get('landlordID')?.setValue(item.id);
          this.searchControl.setValue(item.text);
          this.isDropdownOpen = false; // Close the dropdown 
        }

        clearSelection(): void {
          this.propertyEntryForm.controls['landlordID'].setValue(''); // Clear landlordID
          this.searchControl.setValue(''); // Clear searchControl
          this.isDropdownOpen = false; // Optionally close the dropdown  
        }
      

        searchLandlord() {
        this.searchControl.valueChanges.subscribe((value: any) => {
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


        
    

      ddlsegments: any[] = [];
      loadsegments(): void {       
      const item_id = this.segmentsFormArray.at(0)?.get('segmentID')?.value || '';

      const agency_id = this.sessionAgencyID;

      if (!agency_id) {
        console.error("Error: AgencyID is not available.");
        return;
      }    
      this.propertyService
        .getItemsExtension<any[]>(item_id, agency_id)
        .then((response: any) => {
          const resData = response.data || [];
          this.ddlsegments = resData.map((item: any) => ({
            id: item.id.toString(),
            text: item.text,
          }));
          //console.log("this.ddlsegments ", this.ddlsegments);
        })
        .catch((error: any) => {
          console.error("Error fetching segments:", error);
        });
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
      
        propertyFormInit(){
          this.propertyEntryForm = this.fb.group({
            id: new FormControl(0),
            agencyID: new FormControl(this.sessionAgencyID),
            landlordID: new FormControl('', [Validators.required, Validators.minLength(3)]),
            landlordName: new FormControl(''),
            propertyID: new FormControl(''),    
            propertyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
            propertyType: new FormControl('', [Validators.required, Validators.minLength(3)]),                 
            address: new FormControl('', [Validators.required]),
            contactNumber: new FormControl('', [Validators.required]),
            emailAddress: new FormControl(''),
            propertyDescription: new FormControl(''),
            isActive: new FormControl(true),
            isApproved: new FormControl(true),
            stateStatus: new FormControl('Approved'),

            segments: this.fb.array([this.createSegment()]) // Initialize FormArray
          })     
        }
      
      
        onPropertySubmit(): void {
          if (this.propertyEntryForm.valid) {
            const formValue = this.propertyEntryForm.value;        
            const payload = {
              properties: {
                id: formValue.id || 0,
                landlordID: formValue.landlordID,
                agencyID: this.sessionAgencyID,
                propertyID: formValue.propertyID,
                propertyName: formValue.propertyName,
                propertyType: formValue.propertyType,          
                propertyDescription: formValue.propertyDescription,
                emailAddress: formValue.emailAddress,
                contactNumber: formValue.contactNumber,
                address: formValue.address,
                isActive: formValue.isActive || true,
                isApproved: formValue.isApproved || true,
                stateStatus: formValue.stateStatus || 'Approved',
              },
              propertyWiseSegments: formValue.segments.map((item: any) => ({
                id: item.id || 0,
                agencyID: this.sessionAgencyID,
                propertyID: formValue.propertyID,
                segmentID: item.segmentID,
                segmentName: item.segmentName,
                segmentLength: item.segmentLength,
                segmentWidth: item.segmentWidth,
              })),
            };
           
            this.propertyService.insert(payload).subscribe({
              next: (response: any) => {
                // console.log("response.data.status ", response.data.status);
                // console.log("response.data ", response.data);
                // console.log("response ", response);
                if (response.data.status==true) {
                  this.resetPropertyForm();
                  this.notifyService.showMessage('success', 'Property Info successfully saved.');
                  this.getProperties();
                  this.loadLandlords();
                  this.loadsegments();
                }                 
                if (response.data.isDuplicate==true) {
                  this.notifyService.showMessage('warning', 'Property Name already exists!.');
                }
           
              },
              error: (error: any) => {             
                this.notifyService.showMessage('error', 'Failed to save Property! Please try again.');
              },
            });
          } else {
            this.notifyService.showMessage('error', 'Form is invalid!');
          }
        }
        
        
        resetPropertyForm() {
          this.propertyEntryForm = this.fb.group({
            id: new FormControl(0),
            agencyID: new FormControl(this.sessionAgencyID),
            landlordID: new FormControl('', [Validators.required, Validators.minLength(3)]),
            landlordName: new FormControl(''),
            propertyID: new FormControl(''),    
            propertyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
            propertyType: new FormControl('', [Validators.required, Validators.minLength(3)]),               
            address: new FormControl('', [Validators.required]),
            contactNumber: new FormControl('', [Validators.required]),
            emailAddress: new FormControl(''),
            propertyDescription: new FormControl(''),
            isActive: new FormControl(true),
            isApproved: new FormControl(true),
            stateStatus: new FormControl('Approved'),

            segments: this.fb.array([this.createSegment()]) 
          })
        }
      
        list: any[] = [];
        getProperties() {
          const params = this.propertyEntryForm.value;   
          this.propertyService.getPropertyList(params).subscribe(
            (response) => {      
              this.list = response.body?.data || [];
          
              const pagination = response.headers.get('X-Pagination');
              if (pagination) {
              // console.log('Pagination:', pagination);
                //this.listConfig = JSON.parse(pagination);
              }
            },
            (error) => {
              console.error('API Error:', error);
            }
          );
        }
     
    createSegment(): FormGroup {
      return this.fb.group({
        segmentID: new FormControl(''),
        segmentName: new FormControl('', [Validators.required]),
        segmentLength: new FormControl('', [Validators.required]),
        segmentWidth: new FormControl('', [Validators.required])    
      });
    }


    get segments(): FormArray {
      return this.propertyEntryForm.get('segments') as FormArray;
    }

    addSegment(): void {
      this.segments.push(this.createSegment());
    }

    // Remove a specific row
    removeSegment(index: number): void {
      if (this.segments.length > 1) {
        this.segments.removeAt(index);
      }
    }
    
    segmentNameChanged(event: Event, index: number): void {
      const selectElement = event.target as HTMLSelectElement;
      const id = selectElement.value;     
      if (id === '') {
        return;
      }
    
  
      const duplicateSegmentNames = this.segments.controls.filter(
        (item, i) => item.get('segmentName')?.value === id && i !== index
      );
    
      if (duplicateSegmentNames.length > 0) {
        this.segments.at(index).get('segmentName')?.setValue('');
        this.notifyService.showMessage('warning', 'Duplicate Segment Name Detected!');
        return;
      }
    }


    //  .......................................... Start Item ng-select2  ..........................................
   
    segmentsearchControl = new FormControl('');
    isItemDropdownOpen: boolean = false;

      // Handle item selection
    segmentselect(item: { id: string; text: string }, index: number): void {
      const itemFormGroup = this.segments.at(index);
      if (itemFormGroup) {
        itemFormGroup.get('segmentID')?.setValue(item.id);
        itemFormGroup.get('segmentName')?.setValue(item.text);

        // Clear search control and close dropdown
        this.segmentsearchControl.setValue('');
        this.isItemDropdownOpen = false;
      }
    }

    // Clear selection for a specific row
    itemClearSelection(index: number): void {
      const itemFormGroup = this.segments.at(index);
      if (itemFormGroup) {
        itemFormGroup.get('segmentID')?.setValue('');
        itemFormGroup.get('segmentName')?.setValue('');
      }
    }

    // Toggle dropdown for specific rows (optional if global toggle is acceptable)
    itemToggleDropdown(index: number): void {
    this.isItemDropdownOpen = !this.isItemDropdownOpen;
    }

  //  .......................................... End Item ng-select2  ..........................................

}
