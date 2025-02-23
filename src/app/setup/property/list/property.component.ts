import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgSelect2Module } from 'ng-select2';
import { PropertyService } from '../property.service';
import { AddPropertyModalComponent } from '../insert-update/add-property-modal.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../../../services/modal-services/modal.service';
import { UserService } from '../../../services/user-services/user.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
selector: 'app-property',
standalone: true,
imports: [
  CommonModule, // Ensure CommonModule is imported for basic Angular directives
  ReactiveFormsModule, // Required for Reactive Forms
  NgSelect2Module, // Import NgSelect2Module here,
  FormsModule,
  AddPropertyModalComponent,
  NgxPaginationModule
],
providers:[
  ModalService
],
templateUrl: './property.component.html',
styleUrl: './property.component.scss'
})
export class PropertyComponent implements OnInit{

  propertyForm!: FormGroup;
  sessionAgencyID: any;
  landlordID: any;
  landlordSearchControl = new FormControl('');
  isDropdownOpen = false;

  pageNumber: number = 1;
  pageSize: number = 15;
  listPageConfig: any;

  entryPage: boolean = false;
  listPage: boolean = true;
  detailsPage: boolean = false;

  @ViewChild('showAddPropertiesModal', { static: true }) showAddPropertiesModal!: ElementRef;

  constructor(private fb: FormBuilder, private propertyService: PropertyService, private notifyService: NotifyService, private modalService: ModalService, 
    public userService: UserService) 
    {
      this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
    }

 

  ngOnInit(): void {
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID;     
    this.propertyFormInit();
    this.getProperties();  
    this.loadLandlords();     
    this.searchLandlord();
  }

    ddlLandlords: any[] = [];
    loadLandlords() {
      const landlordID = this.propertyForm.controls['landlordID'].value || '';
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
      this.propertyForm.get('landlordID')?.setValue(item.id);
      this.landlordSearchControl.setValue(item.text);
      this.isDropdownOpen = false; // Close the dropdown 
    }

    clearSelection(): void {
      this.propertyForm.controls['landlordID'].setValue(''); // Clear landlordID
      this.landlordSearchControl.setValue(''); // Clear searchControl
      this.isDropdownOpen = false; // Optionally close the dropdown  
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
      this.propertyForm = this.fb.group({
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
      })     
      this.propertyForm.valueChanges.subscribe((value: any) => {
        this.getProperties();
      });
    }
    

  
    list: any[] = [];
    getProperties() {
      const params = this.propertyForm.value;   
      this.propertyService.getPropertyList(params).subscribe(
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
      this.propertyFormInit();
      this.loadLandlords();
      this.getProperties();
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
      this.propertyForm.get('pageNumber')?.setValue(this.pageNumber);
      this.getProperties();
    }


  expandedRows: { [key: string]: boolean } = {};
  selectedPropertyDetails: { [key: string]: any[] } = {};

  toggleDetails(propertyID: string) {
    this.expandedRows[propertyID] = !this.expandedRows[propertyID];
    
    // Load details only if expanding
    if (this.expandedRows[propertyID] && !this.selectedPropertyDetails[propertyID]) {
      this.loadPropertyDetails(propertyID);
    }
  }  
  
  
  loadPropertyDetails(propertyID: any): void {
    this.propertyService.getPropertyDetails(propertyID, this.sessionAgencyID).subscribe(
      (response) => {
       // console.log('API Response:', response);
        if (response.body?.data) {
          this.selectedPropertyDetails[propertyID] = response.body.data;
          //console.log(`Details loaded for property ID: ${propertyID}`, this.selectedPropertyDetails[propertyID]);
        } 
        else {        
          this.notifyService.showMessage('warning', `No data received for property.`);
          this.selectedPropertyDetails[propertyID] = []; // Set to an empty array to prevent undefined errors
        }
      },
      (error) => {
        console.error('Error fetching property details:', error);
      }
    );
  }
  

  

}

