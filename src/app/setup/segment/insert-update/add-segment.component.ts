import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SegmentService } from '../segment.service';

import { PropertyService } from '../../property/property.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
  selector: 'app-add-segment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-segment.component.html',
  styleUrl: './add-segment.component.scss'
})
export class AddSegmentComponent implements OnInit{
    @Output() childToParent = new EventEmitter<any>();
    itemsFormArray: FormArray;
  
    constructor(private fb: FormBuilder, private segmentService: SegmentService, private notifyService: NotifyService, private propertyService: PropertyService)
    {   
      this.itemsFormArray = this.fb.array([this.createItem()]); 
    }   
  
      segmentEntryForm!: FormGroup;
      sessionAgencyID: any;
      _landlordID: any;
      _propertyID: any;
      _segmentID: any;
      
      landlordSearchControl = new FormControl('');
      propertySearchControl = new FormControl('');
      segmentSearchControl = new FormControl('');
      isLandlordDropdownOpen = false; 
      isPropertyDropdownOpen = false; 
      isSegmentDropdownOpen = false; 

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
            const landlordID = this.segmentEntryForm.controls['landlordID'].value || '';           
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
            this.segmentEntryForm.get('landlordID')?.setValue(item.id); // Set landlord ID
            this.segmentEntryForm.get('landlordName')?.setValue(item.text);
            this._landlordID = item.id;

            this.loadProperties(item.id);
            this.landlordSearchControl.setValue(item.text);
            this.isLandlordDropdownOpen = false; // Close the dropdown 
          }
  
          clearLandlordSelection(): void {
            this.segmentEntryForm.controls['landlordID'].setValue(''); // Clear landlordID
            this.segmentEntryForm.controls['propertyID'].setValue('');
            this.segmentEntryForm.controls['segmentID'].setValue('');
          
            this.landlordSearchControl.setValue(''); // Clear searchControl
            this.isLandlordDropdownOpen = false; // Optionally close the dropdown  

            this.filteredLandlords = this.ddlLandlords;
            this.filteredProperty = [];
            this.filteredSegment = [];
            this._landlordID = '';
            this._propertyID = '';
            this._segmentID = '';
            this.ddlItems = [];
            this.createItem();
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
         const property_id = this.itemsFormArray.at(0)?.get('propertyID')?.value || '';   
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
          this.segmentEntryForm.get('propertyID')?.setValue(item.id);
          this.segmentEntryForm.get('propertyName')?.setValue(item.text);

          this.loadSegments(item.id, this._landlordID);

          this.propertySearchControl.setValue(item.text);
          this.isPropertyDropdownOpen = false; // Close the dropdown 

          this._propertyID = item.id;
       
        }

        clearPropertySelection(): void {
          this.segmentEntryForm.controls['propertyID'].setValue('');
          this.segmentEntryForm.controls['segmentID'].setValue('');
        
          this.propertySearchControl.setValue(''); // Clear searchControl
          this.isPropertyDropdownOpen = false; // Optionally close the dropdown      
          this.filteredProperty = this.ddlProperties;
          this.filteredSegment = [];
          this._propertyID = '';
          this._segmentID = '';

          this.ddlItems = [];
          this.createItem();
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
         const segment_id = this.itemsFormArray.at(0)?.get('segmentID')?.value || '';   
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
          this.segmentEntryForm.get('segmentID')?.setValue(item.id);
          this.segmentEntryForm.get('segmentName')?.setValue(item.text);   
          this.segmentSearchControl.setValue(item.text);
          this.isSegmentDropdownOpen = false;
     
          this._segmentID = item.id;
          this.loadItems(this._propertyID, this._segmentID);
        }

        clearSegmentSelection(): void {
          this.segmentEntryForm.controls['segmentID'].setValue('');
          this.segmentEntryForm.controls['segmentName'].setValue('');
        
          this.segmentSearchControl.setValue('');
          this.isSegmentDropdownOpen = false;  
          this.filteredSegment = this.ddlSegments;     
          this._segmentID = '';     
          this.ddlItems = [];
          this.createItem();
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



      //.................................................................load Items...........................................
      //......................................................................................................................
  
        ddlItems: any[] = [];
        loadItems(_propertyID: any, _segmentID: any): void {       
        const item_id = this.itemsFormArray.at(0)?.get('itemID')?.value || '';
  
        const agency_id = this.sessionAgencyID;
  
        if (!agency_id) {
          console.error("Error: AgencyID is not available.");
          return;
        }    
        this.segmentService.getItemsExtension<any[]>(item_id, agency_id, _propertyID, _segmentID)
          .then((response: any) => {
            this.ddlItems = [];
            this.createItem();
            const resData = response.data || [];
            this.ddlItems = resData.map((item: any) => ({
              id: item.id.toString(),
              text: item.text,
            }));
            //console.log("this.ddlItems ", this.ddlItems);
          })
          .catch((error: any) => {
            console.error("Error fetching items:", error);
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
      
        segmentFormInit(){
          this.segmentEntryForm = this.fb.group({
            id: new FormControl(0),
            agencyID: new FormControl(this.sessionAgencyID),
            segmentWiseItemID: new FormControl(''),
            landlordID: new FormControl('', [Validators.required, Validators.minLength(3)]),
            landlordName: new FormControl(''),
            propertyID: new FormControl('', [Validators.required, Validators.minLength(3)]),    
            propertyName: new FormControl(''),
            segmentID: new FormControl('', [Validators.required, Validators.minLength(3)]),      
            segmentName: new FormControl(''),    
            isActive: new FormControl(true),
            isApproved: new FormControl(true),
            stateStatus: new FormControl('Approved'),

            items: this.fb.array([this.createItem()]) // Initialize FormArray
          })     
        }
      
      
       


      // Create a FormGroup for a single item
    createItem(): FormGroup {
      return this.fb.group({
        itemID: new FormControl('', [Validators.required]),
        itemName: new FormControl(''),
        itemQty: new FormControl('', [Validators.required, Validators.min(1)])
      });
    }

      // Getter for FormArray
    get items(): FormArray {
      return this.segmentEntryForm.get('items') as FormArray;
    }

    // Add a new row
    addItem(): void {
      this.items.push(this.createItem());
    }

    // Remove a specific row
    removeItem(index: number): void {
      if (this.items.length > 1) {
        this.items.removeAt(index);
      }
    }
    
    itemNameChanged(event: Event, index: number): void {
      const selectElement = event.target as HTMLSelectElement; // Explicit cast to HTMLSelectElement
      const id = selectElement.value;
  
      if (id === '') {
        return;
      }
    
      // Check for duplicates
      const duplicateItems = this.items.controls.filter(
        (item, i) => item.get('itemID')?.value === id && i !== index
      );
    
      if (duplicateItems.length > 0) {
        this.items.at(index).get('itemID')?.setValue(''); // Clear the duplicate value
        this.notifyService.showMessage('warning', 'Duplicate Item Detected!');
        return;
      }
    }

    onSegmentSubmit(): void {
      if (this.segmentEntryForm.valid) {
        const formValue = this.segmentEntryForm.value;        
        const payload = {
          segmentWiseItemInfo: {
            id: formValue.id || 0,
            agencyID: this.sessionAgencyID,
            segmentWiseItemID: formValue.segmentWiseItemID || null,
            landlordID: formValue.landlordID,
            propertyID: formValue.propertyID,              
            segmentID: formValue.segmentID,              
            isActive: formValue.isActive || true,
            isApproved: formValue.isApproved || true,
            stateStatus: formValue.stateStatus || 'Approved',
          },
          segmentWiseItemDetails: formValue.items.map((item: any) => ({
            id: item.id || 0,
            segmentWiseItemID: formValue.segmentWiseItemID || null,
            agencyID: this.sessionAgencyID,
            propertyID: formValue.propertyID,
            segmentID: formValue.segmentID,
            itemID: item.itemID,
            itemQty: item.itemQty          
          })),
        };         
        this.segmentService.insert(payload).subscribe({
          next: (response: any) => {
            //console.log("response. ", response);
            if (response?.data?.status) {
              this.resetSegmentForm();
              this.notifyService.showMessage('success', 'Segment wise assign items successfully saved.');
              this.getSegmentWiseItems();
              this.loadLandlords();
           
            }                 
            if (response.data.isDuplicate==true) {
              this.notifyService.showMessage('warning', 'Segment wise assign items already exists!.');
            }              
          },
          error: (error: any) => {             
            this.notifyService.showMessage('error', 'Failed to save Segment wise assign items! Please try again.');
          },
        });
      } else {
        this.notifyService.showMessage('error', 'Form is invalid!');
      }
    }
    
    
    resetSegmentForm() {
      this.segmentEntryForm = this.fb.group({
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

        items: this.fb.array([this.createItem()]) 
      })
    }
  
    list: any[] = [];
    getSegmentWiseItems() {
      const params = this.segmentEntryForm.value;   
      this.segmentService.getSegmentWiseItems(params).subscribe(
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


    //  .......................................... Start Item ng-select2  ..........................................
    
    itemSearchControl = new FormControl('');
    isItemDropdownOpen: boolean = false;

      // Handle item selection
    itemSelect(item: { id: string; text: string }, index: number): void {
      const itemFormGroup = this.items.at(index);
      if (itemFormGroup) {
        itemFormGroup.get('itemID')?.setValue(item.id);
        itemFormGroup.get('itemName')?.setValue(item.text);

        // Clear search control and close dropdown
        this.itemSearchControl.setValue('');
        this.isItemDropdownOpen = false;
      }
    }

    // Clear selection for a specific row
    itemClearSelection(index: number): void {
      const itemFormGroup = this.items.at(index);
      if (itemFormGroup) {
        itemFormGroup.get('itemID')?.setValue('');
        itemFormGroup.get('itemName')?.setValue('');
      }
    }

    // Toggle dropdown for specific rows (optional if global toggle is acceptable)
    itemToggleDropdown(index: number): void {
    this.isItemDropdownOpen = !this.isItemDropdownOpen;
    }

  //  .......................................... End Item ng-select2  ..........................................

  
}
