import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { PageSizeService } from 'src/app/services/pagination-services/page-size.service';
// import { NotifyService } from 'src/app/services/notify-services/notify.service';
// import { ModalService } from 'src/app/services/modal-services/modal.service';
// import { SharedmethodService } from 'src/app/services/shared-method/sharedmethod.service';
import { RoleApiRoutesService } from '../../api-routes/role-api-routes.service';
import { PageSizeService } from '../../../../../../services/pagination-services/page-size.service';
import { NotifyService } from '../../../../../../services/notify-services/notify.service';
import { SharedmethodService } from '../../../../../../services/shared-method/sharedmethod.service';
import { ModalService } from '../../../../../../services/modal-services/modal.service';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  @Input() mode: 'add' | 'update' = 'add';
  @Output() add = new EventEmitter<any>();
  @Input() data: any;
  @Output() update = new EventEmitter<any>();

  title = '';
  form!: FormGroup;
  private modalRef!: NgbModalRef;
  private subscriptions = new Subscription();

  private pageSizeService = inject(PageSizeService);
  private notifyService = inject(NotifyService);
  private roleApiRoutesService = inject(RoleApiRoutesService);
  private sharedmethodService = inject(SharedmethodService);

  listOfPermissions: any[] = []; // Permission list from API
  selectedPermissions: any[] = []; // Selected permission IDs
  allSelected = false; // Tracks "Select All" checkbox state
  sessionAgencyID: any;

  constructor(private fb: FormBuilder, private modalService: ModalService) {
    
  }

  ngOnInit(): void {
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID; 
    this.formInit();
    this.getActivePermissions();
    this.openModal();

    if (this.mode === 'update' && this.data) {
      this.getRolePermissions();
      this.patchRolePermissions();
    }
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formInit(){
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(250)]],
      agencyID: new FormControl(this.sessionAgencyID),        
      stateStatus: new FormControl('Approved'),
      activationStatus: new FormControl('Active'),
      isActive: new FormControl(true),
      isApproved: new FormControl(true),
      permissions: [this.selectedPermissions, [Validators.required]],
    });
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
    this.selectedPermissions = [];
    this.form.get('permissions')?.setValue(this.selectedPermissions);
    this.allSelected = false;
  }

  addRole(newData: any) {
    this.roleApiRoutesService.addRoleApi(newData).subscribe({
      next: (response: any) => {       
        if (response?.data?.success) {      
          this.sharedmethodService.callMethod();
          this.notifyService.showSuccessMessage(response?.data?.message);
          this.closeModal('close');
        } else {
          this.notifyService.showErrorMessage(response?.data?.message);
        }
      },
      error: (err) => this.handleErrors(err),
    });
  }

  updateRole(newData: any) {
    this.roleApiRoutesService.updateRoleApi(newData).subscribe({
      next: (response: any) => {
        if (response?.data?.success) {
          this.sharedmethodService.callMethod();
          this.notifyService.showSuccessMessage(response?.data?.message);
          this.closeModal('close');
        } else {
          this.notifyService.showErrorMessage(response?.data?.message);
        }
      },
      error: (err) => this.handleErrors(err),
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
    const roleSubscription = this.roleApiRoutesService
      .getActivePermissionApi(null)
      .subscribe({
        next: (response: any) => {
          this.listOfPermissions = response?.data;
        },
        error: (error) => this.handleErrors(error),
      });

    this.subscriptions.add(roleSubscription);
  }

  patchRolePermissions() {
    this.form.patchValue(this.data);
    this.selectedPermissions = Array.isArray(this.data.permissions)
      ? [...this.data.permissions]
      : [];
    this.form.get('permissions')?.patchValue(this.selectedPermissions);
    this.updateSelectAllState();
  }

 getRolePermissions() {
    this.roleApiRoutesService
      .getRolePermissionsApi({ roleId: this.data.id, agencyID: this.sessionAgencyID })
      .subscribe({
        next: (response) => {
          //console.log("response?.data?.data ", response?.data?.data);        
          this.selectedPermissions = response?.data?.data || [];
          this.form.get('permissions')?.patchValue(this.selectedPermissions);
  
          this.updateSelectAllState();
        },
        error: () =>
          this.notifyService.showErrorMessage('Error fetching role permissions'),
      });
  }
  

  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Select all permissions
      this.selectedPermissions = this.listOfPermissions.map(
        (p) => p.permissionID
      );
    } else {
      // Deselect all permissions
      this.selectedPermissions = [];
    }

    // Update form and state
    this.form.get('permissions')?.setValue(this.selectedPermissions);
    this.allSelected = isChecked;
  }

  togglePermission(permissionID: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Add permission
      if (!this.selectedPermissions.includes(permissionID)) {
        this.selectedPermissions.push(permissionID);
      }
    } else {
      // Remove permission
      this.selectedPermissions = this.selectedPermissions.filter(
        (id) => id !== permissionID
      );
    }

    // Update form and state
    this.form.get('permissions')?.setValue(this.selectedPermissions);
    this.updateSelectAllState();
  }

  private updateSelectAllState() {
    this.allSelected =
      this.listOfPermissions.length > 0 &&
      this.listOfPermissions.length === this.selectedPermissions.length;
  }
}
