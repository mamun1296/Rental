import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PermissionUserService } from '../permisssion-user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { PageSizeService } from '../../../../services/pagination-services/page-size.service';
import { NotifyService } from '../../../../services/notify-services/notify.service';
import { ModalService } from '../../../../services/modal-services/modal.service';
import { SharedmethodService } from '../../../../services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-add-permission-user-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  templateUrl: './add-permission-user-modal.component.html',
  styleUrl: './add-permission-user-modal.component.scss'
})
export class AddPermissionUserModalComponent implements OnInit, OnDestroy {

    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
  
    @Input() mode: 'add' | 'update' = 'add';
    @Output() add = new EventEmitter<any>();
    @Input() data: any;
    @Output() update = new EventEmitter<any>();
  
    title = "";
    form: FormGroup;
    private modalRef!: NgbModalRef;
    private subscriptions = new Subscription();
  
    private pageSizeService = inject(PageSizeService);
    private notifyService = inject(NotifyService);
    listOfPermissions: any[] = [];
    selectedPermissions: number[] = []; // Assuming permission IDs are numbers
  
    constructor(
      private fb: FormBuilder,
      private modalService: ModalService,
      private permissionUserService: PermissionUserService,
      private sharedmethodService: SharedmethodService
    ) {
      this.title = this.mode === "add" ? "Add Role" : "Update Role";
  
      this.form = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.maxLength(250)]],
        permissions: [this.selectedPermissions] // Initialize permissions array
      });
    }
  
    ngOnInit(): void {
      this.getActivePermissions();
      this.openModal();
  
      if (this.mode === 'update' && this.data) {
        this.getRolePermissions();
        this.patchRolePermissions();
      }
    }
  
    patchRolePermissions() {
      this.form.patchValue(this.data);
  
      this.selectedPermissions = Array.isArray(this.data.permissions) ? [...this.data.permissions] : [];
      this.form.get('permissions')?.patchValue(this.selectedPermissions);
    }
  
    ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
    }
  
    openModal() {
      this.modalRef = this.modalService.open(this.modal, 'lg');
    }
  
    closeModal(reason: any) {
      if (this.modalRef) {
        this.modalService.dismiss(this.modalRef, reason);
      }
      this.closeModalEvent.emit(reason);
    }
  
    confirmAction() {
      if (this.form.valid) {
        if (this.mode === 'update') {
          this.updateRole(this.form.value);
        } else {
          this.addRole(this.form.value);
        }
      }
    }
  
    resetForm() {
      this.form.reset();
      this.selectedPermissions = []; // Reset selected permissions
      this.form.get('permissions')?.setValue(this.selectedPermissions); // Update form with reset permissions
    }
  
    addRole(newData: any) {
      this.permissionUserService.addRoleApi(newData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sharedmethodService.callMethod();
            this.notifyService.showSuccessMessage(response.message);
            this.closeModal('close');
          } else {
            this.notifyService.showErrorMessage(response.message);
          }
        },
        error: (err) => {
          console.error('Error adding role:', err);
          this.handleErrors(err);
        }
      });
    }
  
  
  
    updateRole(newData: any) {
      this.permissionUserService.updateRoleApi(newData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sharedmethodService.callMethod();
            this.notifyService.showSuccessMessage(response.message);
            this.closeModal('close');
          } else {
            this.notifyService.showErrorMessage(response.message);
          }
        },
        error: (err) => {
          console.error('Error updating role:', err);
          this.handleErrors(err);
        }
      });
    }
  
    private handleErrors(err: any) {
      if (err?.errors) {
        for (const key in err.errors) {
          if (err.errors.hasOwnProperty(key)) {
            const messages = err.errors[key];
            messages.forEach((msg: string) => {
              this.notifyService.showErrorMessage(`${key}: ${msg}`);
            });
          }
        }
      } else {
        this.notifyService.showErrorMessage('An unexpected error occurred.');
      }
    }
  
    getActivePermissions(): void {
      const roleSubscription = this.permissionUserService.getActivePermissionApi(null).subscribe({
        next: (response: any) => {
          this.listOfPermissions = response; 
          console.log('listOfPermissions:', response);
  
        },
        error: (error) => {
          console.error(error);
          this.handleErrors(error);
        }
      });
  
      this.subscriptions.add(roleSubscription);
    }
  
    listOfRolePermissions: any[] = [];
    getRolePermissions() {
      this.permissionUserService.getRolePermissionsApi({ roleId: this.data.id }).subscribe({
        next: (response) => {
          this.listOfRolePermissions = response.data; 
          console.log("listOfRolePermissions",this.listOfRolePermissions);
          this.selectedPermissions = [...this.listOfRolePermissions];
          this.form.get('permissions')?.patchValue(this.selectedPermissions);
        },
        error: () => this.notifyService.showErrorMessage('Error fetching role permissions'),
      });
    }
    
    togglePermission(permissionId: any, event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
  
      if (isChecked) {
        // Add the permission if checked
        if (!this.selectedPermissions.includes(permissionId)) {
          this.selectedPermissions.push(permissionId);
        }
      } else {
        // Remove the permission if unchecked
        this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
      }
  
      // Update the form control value
      this.form.get('permissions')?.setValue(this.selectedPermissions);
    }
  
  
}
