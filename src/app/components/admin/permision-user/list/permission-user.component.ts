import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { PermissionUserService } from '../permisssion-user.service';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { NotifyService } from '../../../../services/notify-services/notify.service';
import { UserService } from '../../../../services/user-services/user.service';

@Component({
  selector: 'app-permission-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './permission-user.component.html',
  styleUrl: './permission-user.component.scss'
})

export class PermissionUserComponent implements OnInit {  
    userPermissionForm!: FormGroup;
    sessionAgencyID: any;
    userPermissionID: any;
    agencyEmployeesSearchControl = new FormControl('');
    isAgencyEmployeesDropdownOpen = false;
  
  
  
    entryPage: boolean = false;
    listPage: boolean = true;
    detailsPage: boolean = false;  

    listOfPermissions: any[] = [];
    selectedPermissions: number[] = []; 

    constructor(private fb: FormBuilder, private notifyService: NotifyService, private userPermissionService: PermissionUserService,
      public userService: UserService) 
      {
      
      }    
  
    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.userPermissionFormInit();
      this.getActivePermissions(null);     
      this.loadAgencyEmployees();     
      this.searchAgencyEmployees();
    }




    ddlEmployees: any[] = [];
    loadAgencyEmployees() {
      const agencyEmpID = this.userPermissionForm.controls['agencyEmpID'].value || '';
      const agencyID = this.sessionAgencyID;
      if (!agencyID) {
        console.error("Error: agencyID is not available.");
        return;
      }
      this.userPermissionService
        .getAgencyEmployeesExtension<any[]>(agencyEmpID, agencyID)
        .then((response: any) => {
          const resData = response.data || [];
          this.ddlEmployees = resData.map((employee: any) => ({
            id: employee.id.toString(),
            text: employee.text,
            userId: employee.code
          }));
          this.filteredEmployees = this.ddlEmployees;            
        })
        .catch((error: any) => {
          console.error("Error fetching Agency Employees:", error);
        });
    }

    agencyEmployeesToggleDropdown(): void {
      this.isAgencyEmployeesDropdownOpen = !this.isAgencyEmployeesDropdownOpen;
    }
  
    selectAgencyEmployees(item: { id: string; text: string }): void {
      this.userPermissionForm.get('agencyEmpID')?.setValue(item.id);
      this.agencyEmployeesSearchControl.setValue(item.text);
      this.isAgencyEmployeesDropdownOpen = false; // Close the dropdown
    }

    clearAgencyEmployeesSelection(): void {
      this.userPermissionForm.controls['agencyEmpID'].setValue(''); // Clear AgencyEmployeesID
      this.agencyEmployeesSearchControl.setValue(''); // Clear searchControl
      this.isAgencyEmployeesDropdownOpen = false; // Optionally close the dropdown  
    } 

    searchAgencyEmployees() {
      this.agencyEmployeesSearchControl.valueChanges.subscribe((value: any) => {
        this.filterAgencyEmployees(value);
      });
    } 
      
    filteredEmployees: any[] = [];
    filterAgencyEmployees(value: string): void {
    const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
    this.filteredEmployees = this.ddlEmployees.filter((employee) =>
      employee.id.toLowerCase().includes(filterValue) || 
      employee.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
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

 
    userPermissionFormInit() {
      this.userPermissionForm = this.fb.group({
        id: new FormControl(0),
        userPermissionID: new FormControl(''),
        agencyEmpID: new FormControl('', [Validators.required]),
        agencyID: new FormControl(this.sessionAgencyID),
        userID: new FormControl(''),
        stateStatus: new FormControl('Approved'),
        activationStatus: new FormControl('Active'),
        isActive: new FormControl(true),
        isApproved: new FormControl(true),
        permissions: this.fb.array([]),
      });
    
      this.userPermissionForm.get('agencyEmpID')?.valueChanges.subscribe((agencyEmpID) => {
        if (agencyEmpID) {
          const selectedEmployee = this.ddlEmployees.find(emp => emp.id === agencyEmpID);
          if (selectedEmployee) {        
              this.userPermissionForm.patchValue({
              userID: selectedEmployee.userId           
            });
          } 
          else {      
            this.userPermissionForm.patchValue({
              userID: ''
            });
          }    

          this.getActivePermissions(agencyEmpID);
        } else {
          this.permissions.clear();
          this.userPermissionForm.patchValue({
            userID: ''
          });
        }
      });
    }
    

    // userPermissionFormInit() {
    //   this.userPermissionForm = this.fb.group({
    //     id: new FormControl(0),
    //     userPermissionID: new FormControl(''),
    //     agencyEmpID: new FormControl('', [Validators.required]),
    //     agencyID: new FormControl(this.sessionAgencyID),
    //     userID: new FormControl(''),
    //     stateStatus: new FormControl('Approved'),
    //     activationStatus: new FormControl('Active'),
    //     isActive: new FormControl(true),
    //     isApproved: new FormControl(true),
    //     permissions: this.fb.array([]),
    //   });    
 
    //   this.userPermissionForm.get('agencyEmpID')?.valueChanges.subscribe((agencyEmpID) => {
    //     if (agencyEmpID) {
    //       this.getActivePermissions(agencyEmpID);
    //     } else {
    //       this.permissions.clear();
    //     }
    //   });
    // }
    

    get permissions(): FormArray {
      return this.userPermissionForm.get('permissions') as FormArray;
    }

    getActivePermissions(agencyEmpID: any): void {
      this.userPermissionService.getActivePermissionApi({ agencyEmpID }).subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.listOfPermissions = response.data;
            this.initializePermissions();
          }
        },
        error: (error) => {
          console.error('Error fetching permissions:', error);
        },
      });
    }
    
  
  
    initializePermissions(): void {
      this.permissions.clear();
      this.listOfPermissions.forEach((permission) => {
        this.permissions.push(
          this.fb.group({
            permissionID: [permission.permissionID],
            permissionKey: [permission.permissionKey],
            permissionName: [permission.permissionName],
            isAllowed: [permission.isAllowed || false, Validators.required],
            stateStatus: new FormControl('Approved'),
            activationStatus: new FormControl('Active'),
            isActive: new FormControl(true),
            isApproved: new FormControl(true),
          })
        );
      });
    }
    
  

    isAllSelected: boolean = false;
    toggleSelectAll(event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.isAllSelected = isChecked;

      this.permissions.controls.forEach((control) => {
        control.patchValue({ isAllowed: isChecked });
      });
    }

    togglePermission(index: number, event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      const permissionControl = this.permissions.at(index);
      permissionControl.patchValue({ isAllowed: isChecked });
      this.isAllSelected = this.permissions.controls.every(
        (control) => control.get('isAllowed')?.value
      );
    }
  
    submitForm(): void {
      if (this.userPermissionForm.valid) {
        const formData = this.userPermissionForm.value;
      
        this.userPermissionService.SaveMenuPermissionApi(formData).subscribe({
          next: (response) => {          
            if (response?.data?.status) {
              this.notifyService.showMessage('success', 'Successfully saved.');             
              this.resetForm();
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
    
      getuserPermissions() {
        const params = this.userPermissionForm.value;   
        this.userPermissionService.getActivePermissionApi(params).subscribe(
          (response) => {    
            //console.log("response ", response);  
            this.listOfPermissions = response.body?.data?.list || [];
           
          },
          (error) => {
            console.error('API Error:', error);
          }
        );
      }
    
     
  

  resetForm() {
    this.userPermissionFormInit();
    this.getActivePermissions(null);
  }

  
}