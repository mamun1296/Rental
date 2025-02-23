import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { PermissionRoutesService } from '../permission.service';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import Swal from 'sweetalert2';
import { response } from 'express';
import { ActionComponent } from '../../../action/action.component';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { NotifyService } from '../../../../services/notify-services/notify.service';
import { UserService } from '../../../../services/user-services/user.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent implements OnInit{
    form!: FormGroup;
    permissionListForm!: FormGroup;
    sessionAgencyID: any;
    technicianCategorySearchControl = new FormControl('');
    isTechnicianCategoryDropdownOpen = false;
  
    listPageConfig: any;
      
    entryPage: boolean = false;
    listPage: boolean = true;
    detailsPage: boolean = false;

    pagination = {
      pageNumber: 1,    
      pageSize: 15,
      totalRows: 50,
      totalPages: 0
    };


    ddlStatus: any[];

    constructor(private fb: FormBuilder, private notifyService: NotifyService,
      private userService: UserService,  private permissionService: PermissionRoutesService
    ) 
    {
      this.listPageConfig = this.userService.pageConfigInit("list", this.pagination.pageSize, 1, 0);
      this.ddlStatus = this.userService.getDataStatus();
    } 

    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.formInit();
      this.permissionListFormInit();
      this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber); 
    }

    // loadData() {  
    //   setTimeout(() => {
    //     this.pagination.totalPages = Math.ceil(this.pagination.totalRows / this.pagination.pageSize);
    //   }, 500);
    // }

    
    ddlTechnicianCategory: any[] = [];
 

     technicianCategoryToggleDropdown(): void {
        this.isTechnicianCategoryDropdownOpen = !this.isTechnicianCategoryDropdownOpen;
      }
    
      selectTechnicianCategory(item: { id: string; text: string }): void {
        this.form.get('technicianCategoryID')?.setValue(item.id);
        this.technicianCategorySearchControl.setValue(item.text);
        this.isTechnicianCategoryDropdownOpen = false; // Close the dropdown 
      }
  
      clearTechnicianCategorySelection(): void {
        this.form.controls['technicianCategoryID'].setValue(''); // Clear propertyID
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
      
        formInit(){        
          this.form = this.fb.group({
            id: new FormControl(0),  
            permissionID: new FormControl(''), 
            agencyID: new FormControl(this.sessionAgencyID),
            mainMenuID: new FormControl('', [Validators.required, Validators.min(1)]),
            subMenuID: new FormControl('', [Validators.required, Validators.min(1)]),
            permissionKey: new FormControl('', [Validators.required]),
            permissionType: new FormControl('FrontEnd'),
            permissionName: new FormControl('', [Validators.required]),
            actionId: new FormControl(0),
            stateStatus: new FormControl('Approved'),
            activationStatus: new FormControl('Active'),
            isActive: new FormControl(true),
            isApproved: new FormControl(true)        
          })   
        }
    
        btnSubmit: boolean = false;
        onSubmit(): void {
            if (this.form.valid) {
              this.btnSubmit = true;
              const params = {...this.form.value};             
              
              this.permissionService.addPermissionApi(params).subscribe({
                next: (response: any) => {     
                  if (response?.data?.status) {
                    this.notifyService.showMessage('success', 'Menu successfully saved.');
                    this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber);    
                    this.resetForm();
                  }                 
                  else{
                    if (response?.data?.isDuplicate) {
                      this.notifyService.showMessage('warning', 'Menu Path already exists!.');      
                    }        
                    if (response?.data?.isDuplicateName) {
                      this.notifyService.showMessage('warning', 'Menu Name already exists!.');      
                    }                     
                  }
                
                },
                error: (error: any) => {
                  this.notifyService.showMessage('error', 'Failed to saved information! Please try again.');      
                }
              });
            } else {
              this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');            
            }     
          }
        
          resetForm() {
            this.form = this.fb.group({
              id: new FormControl(0),  
              permissionID: new FormControl(''),
              agencyID: new FormControl(this.sessionAgencyID),
              mainMenuID: new FormControl('', [Validators.required, Validators.min(1)]),
              subMenuID: new FormControl('', [Validators.required, Validators.min(1)]),
              permissionKey: new FormControl('', [Validators.required]),
              permissionName: new FormControl('', [Validators.required]),
              permissionType: new FormControl('FrontEnd'),
              actionId: new FormControl(0),
              stateStatus: new FormControl('Approved'),
              activationStatus: new FormControl('Active'),
              isActive: new FormControl(true),
              isApproved: new FormControl(true)         
            })
          }
        

          permissionListFormInit(){        
            this.permissionListForm = this.fb.group({             
              permissionID: new FormControl(''),            
              agencyID: new FormControl(this.sessionAgencyID),
              mainMenuID: new FormControl('', [Validators.required]),
              subMenuID: new FormControl('', [Validators.required]),
              permissionKey: new FormControl('', [Validators.required]),
              permissionName: new FormControl('', [Validators.required]),
              permissionType: new FormControl('FrontEnd'),           
              stateStatus: new FormControl(''),
              activationStatus: new FormControl(''),
              isActive: new FormControl(''),
              isApproved: new FormControl(''),
              searchString: new FormControl(''),
              sortingCol: new FormControl(''),
              sortType: new FormControl(''),
              pageNumber: new FormControl( this.pagination.pageNumber),
              pageSize: new FormControl( this.pagination.pageSize)   
            })   
             
            this.permissionListForm.get('searchString')?.valueChanges.subscribe((searchValue) => {       
              this.getList(searchValue,  this.pagination.pageNumber);
            });
        }      

        list: any[] = [];
        getList(search: any, pageNumber: number) {

          let params = {
            ...this.permissionListForm.value, searchString: search ?? '', pageNumber: pageNumber
          };  
      
          this.permissionService.getAllPermissionApi(params).subscribe(
            (response) => {                
              this.list = response?.data?.list || [];
         
              if (response?.data?.pagination) {
                this.pagination = {
                  pageNumber: response.data.pagination.pageNumber,
                  pageSize: response.data.pagination.pageSize,
                  totalPages: response.data.pagination.totalPages,
                  totalRows: response.data.pagination.totalRows
                };
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
        this.formInit();    
        this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber);
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
      
      listPageChanged(event: number) {
        this.pagination.pageNumber = event;     
        this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber);  
      }

   

  isEditClicked = false;
  editClick(data: any)
  {
    this.isEditClicked = true;
    this.updateFormData(data);
  }  
  updateFormData(clickedDataForUpdate: any): void {
    this.form.patchValue({
      permissionName: clickedDataForUpdate.permissionName,
      permissionKey: clickedDataForUpdate.permissionKey,
      permissionType: clickedDataForUpdate.permissionType,
      mainMenuID: clickedDataForUpdate.mainMenuID,
      subMenuID: clickedDataForUpdate.subMenuID
    });
    this.form.get('permissionName')?.disable();
    this.form.get('permissionKey')?.disable();
  }

  updateReset()
  {
    this.isEditClicked = false;
    this.resetForm();
    this.form.get('permissionName')?.enable();
    this.form.get('permissionKey')?.enable();
  }

  onUpdate()
  {
    if (this.form.valid) {
      const params = {...this.form.value};             
      
      this.permissionService.updatePermissionApi(params).subscribe({
        next: (response: any) => {     
          // console.log("response",response);
          if (response?.data?.status) {
            this.notifyService.showMessage('success', 'Menu successfully updated.');
            this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber);  
            this.resetForm();
          }                 
        
        
        },
        error: (error: any) => {
          this.notifyService.showMessage('error', 'Failed to Update information! Please try again.');      
        }
      });
    } else {
      this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');            
    }
    this.isEditClicked = false;
    this.resetForm();
  }


  confirmDelete(id:any, name:any): void {
    this.resetForm();
    this.isEditClicked = false;
    Swal.fire({
      title: `Are you sure want to delete permission <b>${name}</b>?`,
      icon: 'warning',
      text:'',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirm', 
      cancelButtonText: 'Cancel', 
      customClass: {
        popup: 'swal-sm-modal',
        title: 'swal-sm-title',
        icon: 'swal-sm-icon',
        confirmButton: 'swal-sm-confirm-btn',
        cancelButton: 'swal-sm-cancel-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionService.deactivatePermissionApi(id).subscribe({
          next:(response:any)=>{
            if (response?.data?.status) {
              Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
              this.getList(this.permissionListForm.get('searchString')?.value, this.pagination.pageNumber);
            }
          },
          error: (error: any) => {
            this.notifyService.showMessage('error', 'Failed to Delete permission! Please try again.');      
          }
        })
       
      }
    });
  }
}

