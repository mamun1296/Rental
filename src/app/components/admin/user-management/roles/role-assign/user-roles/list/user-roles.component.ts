import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRolesModalComponent } from '../user-roles-modal/user-roles-modal.component';
// import { ActionComponent } from 'src/app/components/shared/action/action.component';
// import { PaginationComponent } from 'src/app/components/shared/pagination/pagination.component';
// import { PageSizeService } from 'src/app/services/pagination-services/page-size.service';
// import { NotifyService } from 'src/app/services/notify-services/notify.service';
import { UserRolesApiRoutesService } from '../../api-routes/user-roles-api-routes.service';
import { ActionComponent } from '../../../../../../action/action.component';
import { PaginationComponent } from '../../../../../../pagination/pagination.component';
import { PageSizeService } from '../../../../../../../services/pagination-services/page-size.service';
import { NotifyService } from '../../../../../../../services/notify-services/notify.service';


@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    ActionComponent,
    PaginationComponent,
    UserRolesModalComponent,
  ],
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent {
  
  private pageSizeService = inject(PageSizeService);
  private notifyService = inject(NotifyService);
  
  constructor(
    private userRolesApiRoutesService: UserRolesApiRoutesService
  ) {}

  ngOnInit(): void {
    this.getAllUserRoles();
  }

  pageSize: number = 5;
  pageNumber: number = 1;
  minPagesToShow: number = 5;
  minCurrentPage: number = 2;
  pageSizeOptions: number[] = [];
  totalPage!: number;
  items!: number;
  listOfUserRoles: any[] = [];
  private userName: string = "";
  updateData: any;
  mode!: string;
  showUserRoleModal: boolean = false;

  getAllUserRoles(): void {
    const params: any = {};
    console.log('params', params);

    this.userRolesApiRoutesService.getAllUserRolesApi(params).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        this.listOfUserRoles = response.data.items;
        console.log('listOfUserRoles', this.listOfUserRoles);

        this.items = this.listOfUserRoles.length;
        this.totalPage = response.data.totalPages;

        const totalItems = response.data.totalItems;
        this.pageSizeOptions = this.generatePageSizeOptions(totalItems);

        if (!this.pageSizeOptions.includes(this.pageSize)) {
          this.pageSize = this.pageSizeOptions[0];
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  goToPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getAllUserRoles();
  }
  
  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getAllUserRoles();
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
      // Add implementation for deletion confirmation modal
    }
  }
  
  handleAddActionClick(): void {
    this.openUserRoleModal();
  }

  openUserRoleModal() {
    this.mode = "add";
    this.showUserRoleModal = true;
  }

  closeUserRoleModal() {
    this.showUserRoleModal = false;
  }

  showEditModal: boolean = false;

  openEditModal(data: any) {
    this.showEditModal = true;
    this.updateData = data;
    this.mode = "update";
    console.log("data", data);
  }
  
  closeEditModal() {
    this.showEditModal = false;
    this.updateData = null;
  }

  updateUserRole(updatedData: any) {
    console.log('Updated User Role Data:', updatedData);

    this.userRolesApiRoutesService.updateUserRoleApi(updatedData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.closeUserRoleModal();
          this.notifyService.showSuccessMessage(response.message);
          this.getAllUserRoles(); // Refresh the list after update
        } else {
          this.notifyService.showErrorMessage(response.message);
        }
      },
      error: (err) => {
        console.error('Error updating user role:', err);
        this.handleErrorMessages(err);
      }
    });
  }

  addUserRole(newData: any) {
    this.userRolesApiRoutesService.addUserRoleApi(newData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.closeUserRoleModal();
          this.notifyService.showSuccessMessage(response.message);
          this.getAllUserRoles(); // Refresh the list after adding
        } else {
          this.notifyService.showErrorMessage(response.message);
        }
      },
      error: (err) => {
        console.error('Error adding user role:', err);
        this.handleErrorMessages(err);
      }
    });
  }

  handleErrorMessages(err: any) {
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
}
