import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'alert-content',
  templateUrl: './alert-content.html'
})
export class AlertContent {
  title: string = "Modal Title !";
  content: string = "Modal Content";
  constructor(public activeModal: NgbActiveModal) {}
}