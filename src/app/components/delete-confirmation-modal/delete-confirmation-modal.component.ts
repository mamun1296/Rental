import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../services/modal-services/modal.service';


@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {

  @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() deleteConfirm = new EventEmitter<any>();
  @Input() data!: any;
  
  roleName: any;

  private modalRef!: NgbModalRef;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.openModal();   
  }

  openModal() {
    this.roleName = this.data.name;
    this.modalRef = this.modalService.open(this.deleteModal, 'md');
  }

  closeModal(reason: any) {
    if (this.modalRef) {
      this.modalService.dismiss(this.modalRef, reason);
    }
    this.closeModalEvent.emit(reason);
  }

  closeAllModals(reason: any) {
    this.modalService.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  confirmDelete(){
    this.deleteConfirm.emit(this.data);
    this.closeModal("close");
  }
}
