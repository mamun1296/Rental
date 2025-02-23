import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { SearchSelectComponent } from 'src/app/components/shared/search-select/search-select.component';
// import { NotifyService } from 'src/app/services/notify-services/notify.service';
// import { SharedmethodService } from 'src/app/services/shared-method/sharedmethod.service';
// import { ModalService } from 'src/app/services/modal-services/modal.service';
import { UserApiRoutesService } from '../../api-routes/user-api-routes.service';
import { SearchSelectComponent } from '../../../../../search-select/search-select.component';
import { NotifyService } from '../../../../../../services/notify-services/notify.service';
import { SharedmethodService } from '../../../../../../services/shared-method/sharedmethod.service';
import { ModalService } from '../../../../../../services/modal-services/modal.service';


@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() add = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();

  @Input() mode!: 'add' | 'update';
  @Input() data!: any;

  title = '';
  form!: FormGroup;
  modalRef!: NgbModalRef;
  showPassword = false;

  private notifyService = inject(NotifyService);
  private sharedmethodService = inject(SharedmethodService);

  listOfRoles: any[] = [];

  listOfUserRoles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userApiRoutesService: UserApiRoutesService
  ) {}

  ngOnInit(): void {
    this.openModal();
    this.initializeForm();
    this.setTitle();
    this.getAllRoles();
    this.getAllCategories();

    this.form.get('isDefaultPassword')?.valueChanges.subscribe(this.handlePasswordValidators.bind(this));

    if (this.mode === 'update' && this.data) {
      this.patchUserData();
      this.getUserRoles();
      this.getUserCategories();
    }
  }

  setTitle() {
    this.title = this.mode === 'add' ? 'Add User' : 'Update User';
  }

  initializeForm() {
    this.form = this.fb.group({
      id: [null],
      employeeCode: ['', [Validators.required, Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)]],
      isDefaultPassword: [false],
      defaultPassword: ['', [Validators.minLength(6)]],
      lockoutEnabled: [false],
      twoFactorEnabled: [false],
      roles: [[]],
      categories: [[]],
    });
  }

  patchUserData() {
    this.form.patchValue(this.data);
    
    // Ensure roles and categories are arrays before spreading them
    this.selectedRoles = Array.isArray(this.data.roles) ? [...this.data.roles] : [];
    this.form.get('roles')?.patchValue(this.selectedRoles);
  
    this.selectedCategories = Array.isArray(this.data.categories) ? [...this.data.categories] : [];
    this.form.get('categories')?.patchValue(this.selectedCategories);
  }
  

  getUserRoles() {
    this.userApiRoutesService.getUserRolesApi({ userId: this.data.id }).subscribe({
      next: (response) => {
        this.listOfUserRoles = response.data;
        this.selectedRoles = [...this.listOfUserRoles];
        this.form.get('roles')?.patchValue(this.selectedRoles);
      },
      error: () => this.notifyService.showErrorMessage('Error fetching user roles'),
    });
  }



  getAllRoles() {
    this.userApiRoutesService.getAllRolesApi({}).subscribe({
      next: (response) => {
        this.listOfRoles = response.data;
      },
      error: () => this.notifyService.showErrorMessage('Error fetching roles'),
    });
  }

  selectedRoles: any[] = [];

  toggleRole(role: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      // Add the role if checked
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles.push(role);
      }
    } else {
      // Remove the role if unchecked
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  
    // Update the form control value
    this.form.get('roles')?.patchValue(this.selectedRoles);
  }



 

  listOfCategory: any[] = [];
  selectedCategories: any[] = [];

  getAllCategories() {
    this.userApiRoutesService.getAllCategoriesApi({}).subscribe({
      next: (response) => {
        this.listOfCategory = response;
        console.log("listOfCategory",this.listOfCategory);
      },
      error: () => this.notifyService.showErrorMessage('Error fetching roles'),
    });
  }

  toggleCategory (category: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      // Add the role if checked
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
    } else {
      // Remove the role if unchecked
      this.selectedCategories = this.selectedCategories.filter(r => r !== category);
    }
  
    // Update the form control value
    this.form.get('categories')?.patchValue(this.selectedCategories);
  }


  listOfUserRolCategories: any[] = [];
  getUserCategories() {
    this.userApiRoutesService.getUserCategoriesApi({ userId: this.data.id }).subscribe({
      next: (response) => {
        this.listOfUserRolCategories = response.data;
        console.log("listOfUserRolCategories",this.listOfUserRolCategories);
        this.selectedCategories = [...this.listOfUserRolCategories];
        this.form.get('categories')?.patchValue(this.selectedCategories);
      },
      error: () => this.notifyService.showErrorMessage('Error fetching user categories'),
    });
  }


  handlePasswordValidators(isDefaultPassword: boolean) {
    const defaultPasswordControl = this.form.get('defaultPassword');
    if (isDefaultPassword) {
      defaultPasswordControl?.clearValidators();
      defaultPasswordControl?.setValue('');
    } else {
      defaultPasswordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    defaultPasswordControl?.updateValueAndValidity({ emitEvent: false });
  }

  openModal() {
    this.modalRef = this.modalService.open(this.modal, 'lg');
  }

  closeModal(reason: string) {
    if (this.modalRef) {
      this.modalService.dismiss(this.modalRef, reason);
    }
    this.closeModalEvent.emit(reason);
  }

  confirmAction() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.mode === 'update' ? this.updateUser(formData) : this.addUser(formData);
    }
  }

  addUser(newData: any) {
    this.userApiRoutesService.addUserApi(newData).subscribe({
      next: (response) => {
        response.success ? this.handleSuccess(response.message) : this.notifyService.showErrorMessage(response.message);
      },
      error: this.handleApiErrors.bind(this),
    });
  }

  updateUser(updatedData: any) {
    console.log("updated data",updatedData);
    this.userApiRoutesService.updateUserApi(updatedData).subscribe({
      next: (response) => {
        response.success ? this.handleSuccess(response.message) : this.notifyService.showErrorMessage(response.message);
      },
      error: this.handleApiErrors.bind(this),
    });
  }

  private handleSuccess(message: string) {
    this.closeModal('close');
    this.notifyService.showSuccessMessage(message);
    this.sharedmethodService.callMethod();
  }

  private handleApiErrors(err: any) {
    if (err.errors) {
      for (const key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          err.errors[key].forEach((msg: string) => this.notifyService.showErrorMessage(`${key}: ${msg}`));
        }
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resetForm() {
    this.form.reset();
  }



  status: { id: string; value: string; description?: string; category?: string }[] = [
    { id: '1', value: 'Approved', description: 'am' },
    { id: '2', value: 'Rejected', description: 'jam' },
    { id: '3', value: 'Cancelled', description: 'kola' }
  ]

  selectedStatus: string | null = null;

}
