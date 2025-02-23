import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SearchSelectComponent } from '../../../../../../search-select/search-select.component';
import { ModalService } from '../../../../../../../services/modal-services/modal.service';
import { UserApiRoutesService } from '../../../../users/api-routes/user-api-routes.service';
// import { SearchSelectComponent } from 'src/app/components/shared/search-select/search-select.component';
// import { ModalService } from 'src/app/services/modal-services/modal.service';
// import { UserApiRoutesService } from 'src/app/admin/user-management/users/api-routes/user-api-routes.service';


@Component({
  selector: 'app-user-roles-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchSelectComponent
  ],
  templateUrl: './user-roles-modal.component.html',
  styleUrls: ['./user-roles-modal.component.scss']
})
export class UserRolesModalComponent implements OnInit {

  @ViewChild('modal', { static: true }) modal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  @Input() mode: any; // Specify mode as a union type
  @Output() add = new EventEmitter<any>();
  @Input() data: any; // This will hold user and role information
  @Output() update = new EventEmitter<any>();

  title = "";
  form: FormGroup;
  private modalRef!: NgbModalRef;




  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userApiRoutesService: UserApiRoutesService
  ) {
    this.title = this.mode === "add" ? "Add User Role" : "Update User Role";

    this.form = this.fb.group({
      userId: [null, Validators.required], // User selection
      roles: [[], Validators.required], // Array for selected roles
    });
  }
  
  listOfUsers: any[] = [];

  getAllUsers(): void {

    this.userApiRoutesService.getUsersApi(null).subscribe({
      next: (response: any) => {
        console.log("all user",response);
        this.listOfUsers = response.data;

      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  
  selectedId: number | null = null;

  onSelection(selectedId: any) {
    console.log('Selected button ID:', selectedId);
  }

  onOptionSelected(event: { option: any}) {
    console.log('Selected Option:', event.option);
  }


  // Simulated data, replace with your actual data source
  users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' }
  ];
  
  roles = [
    { id: 1, name: 'Sysadmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'User' }
  ];

  selectedUser: any;
  selectedRoles: any[] = [];



  ngOnInit(): void {
    this.openModal();
    this.getAllUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.form.patchValue(this.data); // Set form values from data
      this.selectedUser = this.data.userId; // Set selected user
      this.selectedRoles = this.data.roles; // Set selected roles
      this.form.get('roles')?.patchValue(this.selectedRoles); // Update roles in the form
    }
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
        this.update.emit(this.form.value); // Emit the form values for update
      } else {
        this.add.emit(this.form.value); // Emit the form values for add
      }
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedRoles = []; // Clear selected roles
  }

  addRole(role: any) {
    if (!this.selectedRoles.includes(role)) {
      this.selectedRoles.push(role);
      this.form.get('roles')?.patchValue(this.selectedRoles);
    }
  }

  removeRole(role: any) {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    this.form.get('roles')?.patchValue(this.selectedRoles);
  }
}
