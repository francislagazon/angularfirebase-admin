import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertContent } from './alert-content';

export interface ALERT_OPTION {
  title?: string;
  content: string;
  'class'?: string;
  timeout?: number;
}

@Injectable()
export class Alert {
  modalRef = null;
  constructor(private modalService: NgbModal) {
  }

  open( option: ALERT_OPTION, yesCallback?: () => void, noCallback?: () => void): NgbModalRef {

    if ( this.modalRef ) this.modalRef.close();
    let modalOption = {};
    if (option.class) modalOption['windowClass'] = option.class;
    else modalOption['windowClass'] = 'enhance-modal';
    modalOption['backdrop'] = false;
    this.modalRef = this.modalService
      .open( AlertContent, modalOption);

    this.modalRef.componentInstance['title'] = option.title;
    this.modalRef.componentInstance['content'] = option.content;

    this.modalRef.result.then((result) => {
      if (yesCallback) yesCallback();
    }, (reason) => {
      if (noCallback) noCallback();
    });


    if ( option.timeout ) {
      setTimeout(()=>{
        this.modalRef.close();
      }, option.timeout);
    }

    return this.modalRef;
  }

}