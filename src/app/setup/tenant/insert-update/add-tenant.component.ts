import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TenantService } from '../tenant.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
  selector: 'app-add-tenant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-tenant.component.html',
  styleUrl: './add-tenant.component.scss'
})
export class AddTenantComponent implements OnInit{
  
  @Output() childToParent = new EventEmitter<any>();
  tenantsDetailFormArray: FormArray;

  constructor(private fb: FormBuilder, private notifyService: NotifyService, private tenantService: TenantService)
  {   
    this.tenantsDetailFormArray = this.fb.array([this.createTenants()]); 
  }   

    tenantEntryForm!: FormGroup;
    sessionAgencyID: any;
    _landlordID: any;
    _propertyID: any;       
  
    propertySearchControl = new FormControl('');

    isPropertyDropdownOpen = false; 


    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.tenantFormInit();
      this.loadProperties();
      this.getTenantsInfo();  
      this.searchProperty();
    
    }
  

      
        //........................................................load Properties................................................
        //..........................................................................................

        ddlProperties: any[] = [];
        loadProperties(): void {       
        const property_id = this.tenantsDetailFormArray.at(0)?.get('propertyID')?.value || '';   
        const agency_id = this.sessionAgencyID;   
    
        if (!agency_id) {
          console.error("Error: AgencyID is not available.");
          return;
        }    
        this.tenantService.getPropertiesExtension<any[]>(property_id, agency_id)
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
        this.tenantEntryForm.get('propertyID')?.setValue(item.id);
        this.tenantEntryForm.get('propertyName')?.setValue(item.text); 
        
        this.propertySearchControl.setValue(item.text);
        this.isPropertyDropdownOpen = false; // Close the dropdown 

        this._propertyID = item.id;
      
      }

      clearPropertySelection(): void {
        this.tenantEntryForm.controls['propertyID'].setValue('');      
      
        this.propertySearchControl.setValue(''); // Clear searchControl
        this.isPropertyDropdownOpen = false; // Optionally close the dropdown      
        this.filteredProperty = this.ddlProperties;        
        this._propertyID = '';
        
        this.createTenants();
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

      userLoginData: any;
      getUserLoginData(): void {
        const storedUserData = localStorage.getItem('userLoginData');
        if (storedUserData) {
          this.userLoginData = JSON.parse(storedUserData);
        } else {
          console.error('No user data found in localStorage.');
        }
      }
    
      tenantFormInit(){
        this.tenantEntryForm = this.fb.group({
          id: new FormControl(0),  
          agencyID: new FormControl(this.sessionAgencyID),
          tenantInfoID: new FormControl(''),
          propertyID: new FormControl('', [Validators.required, Validators.minLength(3)]),
          propertyName: new FormControl(''),    
          stateStatus: new FormControl('Approved'),
          isActive: new FormControl(true),
          isApproved: new FormControl(true), 
          isOwnerProperty: new FormControl(false),  
          tenantsDetail: this.fb.array([this.createTenants()]) // Initialize FormArray
        })     
      }
    
  // Create a FormGroup for a single
  createTenants(): FormGroup {
    return this.fb.group({
      agencyID: new FormControl(this.sessionAgencyID),     
      tenantID: new FormControl(''),
      tenantName: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.email]),    
      contactNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      stateStatus: new FormControl('Approved'),
      isActive: new FormControl(true),
      isApproved: new FormControl(true)
    });
  }

    // Getter for FormArray
  get tenantsDetail(): FormArray {
    return this.tenantEntryForm.get('tenantsDetail') as FormArray;
  }

  // Add a new row
  addTenant(): void {
    this.tenantsDetail.push(this.createTenants());
  }

  // Remove a specific row
  removeTenant(index: number): void {
    if (this.tenantsDetail.length > 1) {
      this.tenantsDetail.removeAt(index);
    }
  }
  


  tenantNameChanged(event: Event, index: number): void {
    const selectElement = event.target as HTMLSelectElement; // Explicit cast to HTMLSelectElement
    const id = selectElement.value;

    if (id === '') {
      return;
    }
  
    // Check for duplicates
    const duplicateTenantsDetail = this.tenantsDetail.controls.filter(
      (item, i) => item.get('tenantName')?.value === id && i !== index
    );
  
    if (duplicateTenantsDetail.length > 0) {
      this.tenantsDetail.at(index).get('tenantName')?.setValue(''); // Clear the duplicate value
      this.notifyService.showMessage('warning', 'Duplicate Tenant Name Detected!');
      return;
    }
  }

  onSubmit(): void {
    if (this.tenantEntryForm.valid) {
      const formValue = this.tenantEntryForm.value;        
      const payload = {
        tenantInfo: {
          id: formValue.id || 0,
          tenantInfoID:formValue.tenantInfoID || null,
          agencyID: this.sessionAgencyID,        
          propertyID: formValue.propertyID,      
          isActive: formValue.isActive || true,
          isApproved: formValue.isApproved || true,
          stateStatus: formValue.stateStatus || 'Approved',
          isOwnerProperty: formValue.isOwnerProperty || false 
        },
        tenantDetails: formValue.tenantsDetail.map((item: any) => ({
          id: item.id || 0,
          tenantInfoID: formValue.tenantInfoID || null,
          agencyID: this.sessionAgencyID,
          propertyID: formValue.propertyID,

          tenantID: item.tenantID,
          tenantName: item.tenantName,
          emailAddress: item.emailAddress,
          contactNumber: item.contactNumber,
          address: item.address,
          isActive: formValue.isActive || true,
          isApproved: formValue.isApproved || true,
          stateStatus: formValue.stateStatus || 'Approved'  ,
          isOwnerProperty: formValue.isOwnerProperty || false                    
        })),
       
      };         
      //console.log("payload ", payload);

      this.tenantService.insert(payload).subscribe({
        next: (response: any) => {
          //console.log("response. ", response);
          if (response?.data?.status) {
            this.resetTenantForm();
            this.notifyService.showMessage('success', 'Tenants Info successfully saved.');
            this.getTenantsInfo();
            this.loadProperties();
          
          }                 
          if (response.data.isDuplicate==true) {
            this.notifyService.showMessage('warning', 'Tenants Info already exists!.');
          }              
        },
        error: (error: any) => {             
          this.notifyService.showMessage('error', 'Failed to save Tenants Info! Please try again.');
        },
      });
    } else {
      this.notifyService.showMessage('error', 'Form is invalid!');
    }
  }
  
  
  resetTenantForm() {
    this.tenantEntryForm = this.fb.group({
      agencyID: new FormControl(this.sessionAgencyID),
      propertyID: new FormControl('', [Validators.required, Validators.minLength(3)]),
      propertyName: new FormControl(''),    
      stateStatus: new FormControl('Approved'),
      isActive: new FormControl(true),
      isApproved: new FormControl(true),  
      isOwnerProperty: new FormControl(false),
      tenantsDetail: this.fb.array([this.createTenants()]) 
      
    })
  }

  list: any[] = [];
  getTenantsInfo() {
    const params = this.tenantEntryForm.value;   
    this.tenantService.getTenantsInfo(params).subscribe(
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


    
  }
  


