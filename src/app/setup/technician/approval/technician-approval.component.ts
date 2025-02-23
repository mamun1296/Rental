import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TenantService } from '../../tenant/tenant.service';
import { TechnicianService } from '../technician.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NotifyService } from '../../../services/notify-services/notify.service';
import { UserService } from '../../../services/user-services/user.service';

@Component({
  selector: 'app-technician-approval',
  standalone: true,
  imports: [
      CommonModule, // Ensure CommonModule is imported for basic Angular directives
      ReactiveFormsModule, // Required for Reactive Form    
      FormsModule,
      NgxPaginationModule,
      MatTabsModule
  ],
  templateUrl: './technician-approval.component.html',
  styleUrl: './technician-approval.component.scss'
})
export class TechnicianApprovalComponent implements OnInit {
    technicianForm!: FormGroup;    
    approvedTechnicianForm!: FormGroup;

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
  
    selectedTab: number = 0; // Default selected tab
    _stateStatus: string = 'Pending'; // Default stateStatus

    @ViewChild('showTechnicianModal', { static: true }) showTechnicianModal!: ElementRef;

    ddlStatus: any[];

    constructor(private fb: FormBuilder, private notifyService: NotifyService,
      private userService: UserService, private tenantService: TenantService, private technicianService: TechnicianService,
    ) 
      {
        this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
        this.ddlStatus = this.userService.getDataStatus();
      } 
      
    ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;     
      this.technicianFormInit();  
      this.approvedTechnicianFormInit();
      this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);         
      this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);       
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
          technicianName: new FormControl(''),
          emailAddress: new FormControl(''),
          contactNumber: new FormControl(''),
          userName: new FormControl(''),
          password: new FormControl(''),  
          technicianCategoryID: new FormControl(''),
          technicianCategoryName: new FormControl(''),
          activationStatus: new FormControl(''),
          stateStatus: new FormControl(''),
          isActive: new FormControl(''),
          isApproved: new FormControl(''),
          searchString: new FormControl('')
        })

        this.technicianForm.get('searchString')?.valueChanges.subscribe((searchValue) => {
          this.getTechnicianInfo(searchValue);
        });     
      }
    
      list: any[] = [];
      getTechnicianInfo(search: any) {    
        const flag = this.selectedTab === 0 ? 'Pending' : 'Approved'; 
        let params = {
          ...this.technicianForm.value, stateStatus: flag ?? '', searchString: search ?? ''
        };  

        this.technicianService.getTechniciansInfo(params).subscribe(
          (response) => {
            this.list = response.body?.data?.list || [];         
            this.list.forEach((technician) => {                      
              if (!this.technicianApprovalControls[technician.technicianID]) {
                this.technicianApprovalControls[technician.technicianID] = new FormControl(false);                  
              }
            });
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
        this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);
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
      this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);    
    }
  
    //-----------------------------------------------Start Bulk Approval----------------------------------------------

    bulkApprovalControl = new FormControl(false); // For bulk checkbox
    technicianApprovalControls: { [key: string]: FormControl } = {}; // Individual checkboxes
    selectedTechnicians: Set<string> = new Set(); // Track selected techniciants
    _selectTechnicianStatus: any;
    _technicianID: any;
    btnAllApproval: boolean = false;
    
    toggleAllSelections() {
      const isBulkSelected = this.bulkApprovalControl.value;
      this.list.forEach((technician: any) => { 
        this.btnAllApproval = true;
        this._selectTechnicianStatus = technician.stateStatus;  
        this._technicianID = technician.landlordID;  
        if (technician.stateStatus === 'Pending') {
          this.technicianApprovalControls[technician.technicianID].setValue(isBulkSelected);
          if (isBulkSelected) {
            this.selectedTechnicians.add(technician.technicianID);
          } else {
            this.selectedTechnicians.delete(technician.technicianID);
          }
        }
      });
    }
    
    toggleIndividualSelection(technicianID: string) {
      this.list.forEach((tech: any) => { 
        this._technicianID = tech.landlordID;  
      });

      const isSelected = this.technicianApprovalControls[technicianID].value;       
      if (isSelected) {                 
        this.selectedTechnicians.add(technicianID);
      } else {
        this.selectedTechnicians.delete(technicianID);
      }
      this.bulkApprovalControl.setValue(
        this.list.every(
          (tech) =>
            this.technicianApprovalControls[tech.technicianID].value ||
          tech.stateStatus !== 'Pending'
        )
      );
    }

  bulkApproveSelected() {
    const selectedIds = Array.from(this.selectedTechnicians);
  
    if (selectedIds.length === 0) {
      this.notifyService.showMessage('warning', 'No technicians selected for approval.');
      return;
    }
  
    const params = {
      technicianID: null, // This should be null because we are using `technicianApprovalDtos`.
      flag: 'Bulk_Approval',
      agencyID: this.sessionAgencyID,
      stateStatus: 'Approved',
      approveTechnicianDtos: selectedIds.map((id) => ({
        technicianID: id,
        stateStatus: 'Approved', // Assuming this status applies to all.
      })),
    };
  
    this.technicianService.approval(params).subscribe(
      (response) => {
        if (response?.data?.status) {
          this.notifyService.showMessage('success', 'All selected technicians approved successfully.');
          this.bulkApprovalControl = new FormControl(false); 
          this.btnAllApproval = false;

          selectedIds.forEach((id) => {
            this.technicianApprovalControls[id].setValue(false); // Uncheck individual checkboxes
          });  

          this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
          this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);    
        }
      },
      (error) => {
        console.error('Error approving techniciants:', error);
        this.notifyService.showMessage('error', 'Failed to approve techniciants.');
      }
    );
  }
    
  selectedApprove(technicianID: any){
    if (technicianID.length === 0) {
      this.notifyService.showMessage('warning', 'No techniciants selected for approval.');
      return;
    }
    const selectedIds = Array.from(this.selectedTechnicians);

    const params = {
      technicianID: technicianID,
      flag: 'Selected_Approval',    
      agencyID: this.sessionAgencyID,
      stateStatus: 'Approved',
      approveTechnicianDtos: selectedIds.map((id) => ({
        technicianID: id
      })),
    };  
    this.technicianService.approval(params).subscribe(
      (response) => {
        if(response?.data?.status){
        this.notifyService.showMessage('success', 'Selected techniciants approved successfully.');
        this.technicianApprovalControls[technicianID].setValue(false);
        this.bulkApprovalControl = new FormControl(false); 
        this.btnAllApproval = false;
        this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
        this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);
        }
      },
      (error) => {
        console.error('Error approving techniciants:', error);
      }
    );
  }
    
    //-----------------------------------------------End Bulk Approval----------------------------------------------
    
    selectTab(tabIndex: number) {
      this.selectedTab = tabIndex;       
      this.getTechnicianInfo(this.technicianForm.get('searchString')?.value);
      this.getTechnicianInfo(this.approvedTechnicianForm.get('searchString')?.value);
    }
 
    //-------------------------------Start 2nd Tab ---------------------------------------------------------------------

    approvedTechnicianFormInit(){
      this.approvedTechnicianForm = this.fb.group({
        id: new FormControl(0),  
        technicianID: new FormControl(''),
        agencyID: new FormControl(this.sessionAgencyID),
        technicianName: new FormControl(''),
        emailAddress: new FormControl(''),
        contactNumber: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl(''),  
        technicianCategoryID: new FormControl(''),
        technicianCategoryName: new FormControl(''),
        activationStatus: new FormControl(''),
        stateStatus: new FormControl(''),
        isActive: new FormControl(''),
        isApproved: new FormControl(''),
        searchString: new FormControl(''),     
      })

      this.approvedTechnicianForm.get('searchString')?.valueChanges.subscribe((searchValue) => {
        this.getTechnicianInfo(searchValue);
      });     
    }
    
    //-------------------------------End 2nd Tab ---------------------------------------------------------------------
}

