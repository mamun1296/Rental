import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TechnicianService } from '../technician.service';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { UserService } from '../../../services/user-services/user.service';

@Component({
  selector: 'app-technician',
  standalone: true,
  imports: [
      CommonModule, // Ensure CommonModule is imported for basic Angular directives
      ReactiveFormsModule, // Required for Reactive Form    
      FormsModule,
      NgxPaginationModule
  ],
  templateUrl: './technician.component.html',
  styleUrl: './technician.component.scss'
})

export class TechnicianComponent implements OnInit {

    technicianForm!: FormGroup;

    sessionAgencyID: any;
    technicianID: any;
    technicianCategorySearchControl = new FormControl('');
    isTechnicianCategoryDropdownOpen = false;
  
    pageNumber: number = 1;
    pageSize: number = 15;
    listPageConfig: any;
      
    entryPage: boolean = false;
    listPage: boolean = true;
    detailsPage: boolean = false;
  
    @ViewChild('showTechnicianModal', { static: true }) showTechnicianModal!: ElementRef;

    ddlStatus: any[];

    constructor(private fb: FormBuilder, private notifyService: NotifyService,
      private userService: UserService, private technicianService: TechnicianService,
    ) 
      {
        this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
        this.ddlStatus = this.userService.getDataStatus();
      } 
      
    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.technicianFormInit();
      this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
      this.loadTechnicianCategory();     
      this.searchTechnicianCategory();
    }

    
    ddlTechnicianCategory: any[] = [];
    loadTechnicianCategory() {
      const technicianCategoryID = this.technicianForm.controls['technicianCategoryID'].value || '';
      const agencyID = this.sessionAgencyID;
      if (!agencyID) {
        console.error("Error: agencyID is not available.");
        return;
      }
      this.technicianService.getTechnicianCategoriesExtension<any[]>(technicianCategoryID, agencyID)
        .then((response: any) => {
          const resData = response.data || [];
          this.ddlTechnicianCategory = resData.map((tech: any) => ({
            id: tech.id.toString(),
            text: tech.text,
          }));
          this.filteredtechnicianCategories = this.ddlTechnicianCategory;      
        })
        .catch((error: any) => {
          console.error("Error fetching technician category:", error);
        });
    }

     technicianCategoryToggleDropdown(): void {
        this.isTechnicianCategoryDropdownOpen = !this.isTechnicianCategoryDropdownOpen;
      }
    
      selectTechnicianCategory(item: { id: string; text: string }): void {
        this.technicianForm.get('technicianCategoryID')?.setValue(item.id);
        this.technicianCategorySearchControl.setValue(item.text);
        this.isTechnicianCategoryDropdownOpen = false; // Close the dropdown 
      }
  
      clearTechnicianCategorySelection(): void {
        this.technicianForm.controls['technicianCategoryID'].setValue(''); // Clear propertyID
        this.technicianCategorySearchControl.setValue(''); // Clear searchControl
        this.isTechnicianCategoryDropdownOpen = false; // Optionally close the dropdown  
      } 
  
      searchTechnicianCategory() {
        this.technicianCategorySearchControl.valueChanges.subscribe((value: any) => {
          this.filterTechnicianCategory(value);
        });
      } 
        
      filteredtechnicianCategories: any[] = [];
      filterTechnicianCategory(value: string): void {
      const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
      this.filteredtechnicianCategories = this.ddlTechnicianCategory.filter((tech) =>
        tech.id.toLowerCase().includes(filterValue) || 
      tech.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
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
      
        technicianFormInit(){        
          this.technicianForm = this.fb.group({
            id: new FormControl(0),  
            technicianID: new FormControl(''),
            agencyID: new FormControl(this.sessionAgencyID),
            technicianName: new FormControl('', [Validators.required]),
            emailAddress: new FormControl('', [Validators.required, Validators.email]),
            contactNumber: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)]),  
            technicianCategoryID: new FormControl('', [Validators.required]),
            technicianCategoryName: new FormControl(''),
            stateStatus: new FormControl(''),
            activationStatus: new FormControl(''),
            isActive: new FormControl(''),
            isApproved: new FormControl(''),
            searchString: new FormControl(''),
          })   
           
          this.technicianForm.get('searchString')?.valueChanges.subscribe((searchValue) => {
            this.getTechnicianInfo(searchValue);
          });
        }
    
        btnSubmit: boolean = false;
        onSubmit(): void {
            if (this.technicianForm.valid) {
              this.btnSubmit = true;
              const params = {...this.technicianForm.value, isActive: true, isApproved: false, stateStatus: 'Pending', activationStatus: 'Active'};             
              
              this.technicianService.insert(params).subscribe({
                next: (response: any) => {             
                  if (response?.data?.status) {
                    this.notifyService.showMessage('success', 'Technician has been successfully saved.');
                    this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);    
                    this.resetForm();
                  }                 
                  else{
                    if (response?.data?.isDuplicateEmail) {
                      this.notifyService.showMessage('warning', 'Email already exists!.');      
                    } 
                    if (response?.data?.isDuplicateUser) {
                      this.notifyService.showMessage('warning', 'User name already exists!.');      
                    } 
                    if (response?.data?.isDuplicateContact) {
                      this.notifyService.showMessage('warning', 'Contact number already exists!.');      
                    }                                    
                  }
                
                },
                error: (error: any) => {
                  this.notifyService.showMessage('error', 'Failed to save Technician! Please try again.');      
                }
              });
            } else {
              this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');
            
            }     
          }
        
          resetForm() {
            this.technicianForm = this.fb.group({
              id: new FormControl(0),  
              technicianID: new FormControl(''),
              agencyID: new FormControl(this.sessionAgencyID),
              technicianName: new FormControl('', [Validators.required]),
              emailAddress: new FormControl('', [Validators.required, Validators.email]),
              contactNumber: new FormControl('', [Validators.required]),
              address: new FormControl('', [Validators.required]),
              userName: new FormControl('', [Validators.required]),
              password: new FormControl('', [Validators.required, Validators.minLength(4)]),  
              technicianCategoryID: new FormControl('0', [Validators.required]),
              technicianCategoryName: new FormControl(''),
              stateStatus: new FormControl(''),
              activationStatus: new FormControl(''),
              isActive: new FormControl(''),
              isApproved: new FormControl(''),
              searchString: new FormControl(''),
            })
          }
        

        list: any[] = [];
        getTechnicianInfo(search: any) {

          let params = {
            ...this.technicianForm.value,  searchString: search ?? ''
          };  
      
          this.technicianService.getTechniciansInfo(params).subscribe(
            (response) => {
              this.list = response.body?.data?.list || [];
         
              const pagination = response.headers.get('X-Pagination');
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
        this.technicianFormInit();
        this.loadTechnicianCategory();
        this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
      }
      
      fnBackToList(event: any) {
        this.entryPage = false;
        this.listPage = true;
        this.detailsPage = false;
      }
      
      createtechnician() {
        this.listPage = false;
        this.entryPage = true;
      }
      
    
    listPageChanged(event: any) {
      this.pageNumber = event;
      this.technicianForm.get('pageNumber')?.setValue(this.pageNumber);
      this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
    }
  
  
      
}

