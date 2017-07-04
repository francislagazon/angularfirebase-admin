import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    USER,
    UserService
} from './../../../firebase-backend/firebase-backend.module';

import { SharedService, IAlert } from './../../provider/shared.service';

@Component({
    selector: 'user-edit-modal',
    templateUrl: './user.edit.form.html'
})

export class UserEditForm implements OnInit {
    
    form: FormGroup;
    option: USER;

    error: IAlert = {
        message: '',
        type: 'success'
    };

    constructor(
        public activeModal: NgbActiveModal, 
        private fb: FormBuilder, 
        private user: UserService,
        private shared: SharedService
    ) {
        
    }   

    ngOnInit() {
        this.form = this.fb.group({
            key:            [this.option.key, Validators.required],
            id:             [this.option.uid, Validators.required],
            name:           [this.option.name, Validators.required], 
            displayName:    [this.option.displayName, Validators.required],
            email:          [this.option.email, Validators.required]
        });
    }

    onSubmit() {
        let data: USER = {
            uid:            this.form.value.id,
            name:           this.form.value.name,
            displayName:    this.form.value.displayName,
            email:          this.form.value.email
        }
        let key = this.form.value.key;

        this.user.editUser( key, data )
            .then(id => this.activeModal.close() )
            .catch( e => this.shared.errorWrap( e.message ))
    }
}