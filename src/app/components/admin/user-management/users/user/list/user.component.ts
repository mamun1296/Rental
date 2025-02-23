import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { Subscription } from 'rxjs';
// import { PageSizeService } from 'src/app/services/pagination-services/page-size.service';
// import { NotifyService } from 'src/app/services/notify-services/notify.service';
import { UserApiRoutesService } from '../../api-routes/user-api-routes.service';
// import { SharedmethodService } from 'src/app/services/shared-method/sharedmethod.service';
// import { PagePermissionsService } from 'src/app/services/page-permissions-service/page-permissions.service';
import { DeleteConfirmationModalComponent } from '../../../../../delete-confirmation-modal/delete-confirmation-modal.component';
import { PaginationComponent } from '../../../../../pagination/pagination.component';
import { PageSizeService } from '../../../../../../services/pagination-services/page-size.service';
import { NotifyService } from '../../../../../../services/notify-services/notify.service';
import { SharedmethodService } from '../../../../../../services/shared-method/sharedmethod.service';
import { PagePermissionsService } from '../../../../../../services/page-permissions-service/page-permissions.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    UserModalComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'] 
})

export class UserComponent implements OnInit, OnDestroy {
  private pageSizeService = inject(PageSizeService);
  private notifyService = inject(NotifyService);
  private userApiRoutesService = inject(UserApiRoutesService);
  private sharedmethodService = inject(SharedmethodService);
  private pagePermissionsService = inject(PagePermissionsService);

  private subscription: Subscription = new Subscription(); 

  pageSize: number = 10;
  pageNumber: number = 1;
  minPagesToShow: number = 5;
  minCurrentPage: number = 2;
  pageSizeOptions: number[] = [];
  totalPage!: number;
  items!: number;
  listOfUsers: any[] = [];
  private userName: string = "";

  permissions: any[] | null = null;

  ngOnInit(): void {

    
    this.getAllUsers();


    this.subscription.add(this.sharedmethodService.methodCall$.subscribe(() => {
        if(this.pageSize < 10 ){
          this.pageSize = this.pageSize + 1
        }
        this.getAllUsers();
      }
    ));

    this.getAllRoles();


  }

  // Method to check if a user has a specific action permission
  hasPermission(actionId: number[]): boolean {
    return this.pagePermissionsService.hasPermission(actionId);
  }

  hasAddPermission(): boolean {
    return this.pagePermissionsService.hasAddPermission();
  }

  
  hasEditPermission(): boolean {
    return this.pagePermissionsService.hasEditPermission();
  }

  hasDeletePermission(): boolean {
    return this.pagePermissionsService.hasDeletePermission();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllUsers(): void {
    const params: any = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    if (this.userName) {
      params['userName'] = this.userName;
    }

    this.userApiRoutesService.getAllUserApi(params).subscribe({
      next: (response: any) => {
        // console.log('User response:', response);
        this.listOfUsers = response.data.items;
        this.items = this.listOfUsers.length;
        this.totalPage = response.data.totalPages;
        const totalItems = response.data.totalItems;

        // Generate and update page size options dynamically
        this.pageSizeOptions = this.generatePageSizeOptions(totalItems);

        // Adjust page size based on the number of items on the current page
        if (this.items < this.pageSize) {
          this.pageSize = this.items;
        }

        // Ensure the page size is valid
        if (!this.pageSizeOptions.includes(this.pageSize)) {
          this.pageSize = this.pageSizeOptions[0];
        }


        
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  goToPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getAllUsers();
  }
  
  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getAllUsers();
  }

  maxPageSize: number = 50;

  generatePageSizeOptions(totalItems: number): number[] {
    return this.pageSizeService.generatePageSizeOptions(totalItems, this.pageSize, this.maxPageSize);
  }

  itemActions = this.getItemActions();

  getItemActions() {
    return [
      { buttonName: 'Edit', icon: 'fas fa-pencil-alt', cssClass: 'btn-action', tooltip: 'Edit', isActive: true, isDisabled: false },
      { buttonName: 'Delete', icon: 'fa-solid fa-trash', cssClass: 'btn-action', tooltip: 'Delete' }
    ];
  }

  handleActionClick(label: any, data: any) {
    if (label === 'Edit') {
      this.openEditModal(data);
    } else if (label === 'Delete') {
      this.openDeleteConfirmationModal(data);
    }
  }

  updateData: any;
  deleteData: any;
  mode: any;
  showUserModal: boolean = false;
  showEditModal: boolean = false;
  showDeleleteConfirmationModal: boolean = false;

  openUserModal() {
    this.mode = "add";
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
  }

  openEditModal(data: any) {
    this.showEditModal = true;
    this.updateData = data;
    this.mode = "update";
  }

  closeEditModal() {
    this.showEditModal = false;
    this.updateData = null;
  }

  openDeleteConfirmationModal(data: any) {
    this.showDeleleteConfirmationModal = true;
    this.deleteData = data;
    // console.log('data', data);
  }
  
  closeDeleteConfirmationModal() {
    this.showDeleleteConfirmationModal = false;
  }

  deleteUser(deleteData: any) {
    // console.log('Deleted data', deleteData);
    this.userApiRoutesService.deleteUserApi(deleteData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sharedmethodService.callMethod();
          this.notifyService.showSuccessMessage(response.message);
        } else {
          this.notifyService.showErrorMessage(response.message);
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




  listOfRoles: any[] = [];

  getAllRoles(): void {
    const params: any = {};

    this.userApiRoutesService.getAllRolesApi(params).subscribe({
      next: (response: any) => {
        // console.log("role response", response);
        this.listOfRoles = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }



}
