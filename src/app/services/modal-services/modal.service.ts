import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  closeResult: string = '';
  private modalRefs: NgbModalRef[] = [];

  constructor(private modalService: NgbModal) { }

  open(content: any, size: string): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: size,
      backdrop: 'static',
      keyboard: false,
      container: 'app-root',
      centered: true,
      scrollable: true 
    });

    this.modalRefs.push(modalRef);

    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.removeModalRef(modalRef);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.removeModalRef(modalRef);
    });

    return modalRef;
  }

  dismiss(modalRef: NgbModalRef, reason: any) {
    modalRef.dismiss(reason);
    this.removeModalRef(modalRef);
  }

  dismissAll(reason: any) {
    while (this.modalRefs.length) {
      const modalRef = this.modalRefs.pop();
      if (modalRef) {
        modalRef.dismiss(reason);
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private removeModalRef(modalRef: NgbModalRef) {
    const index = this.modalRefs.indexOf(modalRef);
    if (index > -1) {
      this.modalRefs.splice(index, 1);
    }
  }
}
