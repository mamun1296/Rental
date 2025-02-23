import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActionComponent } from 'src/app/components/shared/action/action.component';
import { PaginationComponent } from 'src/app/components/shared/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from 'src/app/components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { PageSizeService } from 'src/app/services/pagination-services/page-size.service';
import { NotifyService } from 'src/app/services/notify-services/notify.service';
import { RoleApiRoutesService } from '../../api-routes/role-api-routes.service';
import { SharedmethodService } from 'src/app/services/shared-method/sharedmethod.service';


@Component({
  selector: 'app-role22222',
  standalone: true,
  imports: [
    CommonModule,
    ActionComponent,
    PaginationComponent,
    RoleModalComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './role.componentcopy.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  private pageSizeService = inject(PageSizeService);
  private notifyService = inject(NotifyService);
  sessionAgencyID: any;

  constructor(private roleApiRoutesService: RoleApiRoutesService,
    private sharedmethodService: SharedmethodService
  ) {}


  ngOnInit(): void {
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID;     
    this.getAllRoles();

   this.sharedmethodService.methodCall$.subscribe(() => {
    if(this.pageSize < 10 ){
      this.pageSize = this.pageSize + 1
    }
      this.getAllRoles();
    });
  }

  pageSize: number = 10;
  pageNumber: number = 1;
  minPagesToShow: number = 5;
  minCurrentPage: number = 2;
  pageSizeOptions: number[] = [];
  totalPage!: number;
  items!: number;
  listOfRoles: any[] = [];
  maxPageSize: number = 50;

  userLoginData: any;
    getUserLoginData(): void {
      const storedUserData = localStorage.getItem('userLoginData');
      if (storedUserData) {
        this.userLoginData = JSON.parse(storedUserData);
      } else {
        console.error('No user data found in localStorage.');
      }
    }

    getAllRoles(): void {
      const params: any = {
        pageNumber: Math.max(this.pageNumber || 1, 1),
        pageSize: Math.max(this.pageSize || 1, 1),  // Ensure pageSize is a valid number
      };
    
      this.roleApiRoutesService.getAllRoleApi(params).subscribe({
        next: (response: any) => {
        
          // Ensure correct access to API pagination data
          const pagination = response?.data?.pagination;
    
          if (!pagination) {
            console.error("Pagination data missing in response");
            return;
          }
    
          this.listOfRoles = response?.data?.list || [];
          this.items = this.listOfRoles.length;
          this.totalPage = pagination.TotalPages;
          const totalItems = pagination.TotalRows;    

          if (typeof totalItems === "number" && totalItems > 0) {
            this.pageSizeOptions = this.generatePageSizeOptions(totalItems);
          } else {
            console.warn("Invalid totalItems value, setting default pageSizeOptions.");
            this.pageSizeOptions = [10, 20, 30, 50];
          }
   
          if (!this.pageSizeOptions.includes(this.pageSize)) {
            this.pageSize = this.pageSizeOptions[0];
          }
        },
        error: (error) => {
          console.error("Error fetching roles:", error);
        },
      });
    }

    
 

  generatePageSizeOptions(totalItems: number): number[] {
    if (!totalItems || totalItems < 1) {
      console.warn("Invalid totalItems for pageSize options, using defaults.");
      return [10, 20, 30, 50];
    }
  
    return this.pageSizeService.generatePageSizeOptions(totalItems, this.pageSize, this.maxPageSize);
  }
  
  goToPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getAllRoles();
  }

  changePageSize(newPageSize: number): void {
    if (!newPageSize || isNaN(newPageSize) || newPageSize < 1) {
      console.warn("Invalid page size selected, using default.");
      this.pageSize = this.pageSizeOptions[0];
    } else {
      this.pageSize = newPageSize;
    }
    this.getAllRoles();
  }
  

  itemActions = this.getItemActions();

  getItemActions() {
    return [
      { buttonName: 'Edit', icon: 'fa fa-pencil', cssClass: 'btn-action btn-primary', tooltip: 'Edit', isActive: true, isDisabled: false },
      { buttonName: 'Delete', icon: 'fa fa-trash', cssClass: 'btn-action btn-danger', tooltip: 'Delete' },
    ];
  }

  handleActionClick(label: any, data: any) {
    if (label === 'Edit') {
      this.openEditModal(data);
    }
     else if (label === 'Delete') {
    this.openDeleteConfirmationModal(data);
  }
  }

  handleAddActionClick(): void {
    this.openRoleModal();
  }

  showRoleModal: boolean = false;
  showEditModal: boolean = false;
  updateData: any;
  mode: any;

  openRoleModal() {
    this.mode = 'add';
    this.showRoleModal = true;
  }

  closeRoleModal() {
    this.showRoleModal = false;
  }

  openEditModal(data: any) {
    this.showEditModal = true;
    this.updateData = data;
    this.mode = 'update';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.updateData = null;
  }

  updateRole(updatedData: any) {
    const updateSubscription = this.roleApiRoutesService.updateRoleApi(updatedData).subscribe({
      next: (response: any) => {
        if (response?.data?.success) {
          this.closeRoleModal();
          this.notifyService.showSuccessMessage(response?.data?.message);
        } else {
          this.notifyService.showErrorMessage(response?.data?.message);
        }
      },
      error: (err) => {
        console.error('Error updating role:', err);
        this.handleErrors(err);
      },
    });


  }

  addRole(newData: any) {
    const addSubscription = this.roleApiRoutesService.addRoleApi(newData).subscribe({
      next: (response: any) => {
        if (response?.data?.success) {
          this.closeRoleModal();
          this.notifyService.showSuccessMessage(response?.data?.message);
        } else {
          this.notifyService.showErrorMessage(response?.data?.message);
        }
      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.handleErrors(err);
      },
    });


  }

  private handleErrors(err: any) {
    if (err.errors) {
      for (const key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          const messages = err.errors[key];
          messages.forEach((msg: string) => {
            this.notifyService.showErrorMessage(`${key}: ${msg}`);
          });
        }
      }
    }
  }


  showDeleleteConfirmationModal: boolean = false;
  deleteData: any;
  openDeleteConfirmationModal(data: any) {
    this.showDeleleteConfirmationModal = true;
    this.deleteData = data;  
  }
  
  closeDeleteConfirmationModal() {
    this.showDeleleteConfirmationModal = false;
  }

  deleteRole(deleteData: any) {   
    this.roleApiRoutesService.deleteRoleApi(deleteData).subscribe({
      next: (response: any) => {
        if (response?.data?.success) {
          this.sharedmethodService.callMethod();
          this.notifyService.showSuccessMessage(response?.data?.message);
        } else {
          this.notifyService.showErrorMessage(response?.data?.message);
        }
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.handleApiErrors(err);
      }
    });
  }


  private handleApiErrors(err: any) {
    if (err.errors) {
      for (const key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          const messages = err.error.errors[key];
          messages.forEach((msg: string) => {
            this.notifyService.showErrorMessage(`${key}: ${msg}`);
          });
        }
      }
    }
  }




  
}
