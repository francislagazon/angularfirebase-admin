import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  UserService,
  USER, USERS,
  ForumService
} from './../../../firebase-backend/firebase-backend.module';

import { SharedService, IAlert } from './../../provider/shared.service';


@Component({
    selector: 'app-profile',
    templateUrl: 'profile.html'
})

export class Profile implements OnInit, AfterViewInit {
    error: IAlert = {
        message: '',
        type: 'success'
    };
    form: FormGroup;
    userProfile: USER = {
        key: '',
        uid: '',
        displayName: '',
        email: '',
        photoURL: '',
        providerId: ''
    };

    constructor(
    public user: UserService, 
    private shared: SharedService,
    private fb: FormBuilder, 
    ) {
        this.initializeForm();
    }
    
    ngOnInit(){
        
    }

    ngAfterViewInit() {

        this.user.setProfile(this.user.uid)
        .then( res => {
            this.form.patchValue({
                displayName:    this.user.profile.displayName,
                email:          this.user.profile.email,
                providerId:     this.user.profile.providerId
            });
            this.userProfile.photoURL = this.user.profile.photoURL;
        })
        
    }

    initializeForm() {
        this.form = this.fb.group({
            displayName:    [ '' , Validators.required],
            email:          [ '' , Validators.required],
            providerId:     [ '' , Validators.required]
        });
    }

    onSubmitProfile() {
        let data: USER = {
            displayName: this.form.value.displayName,
            photoURL: this.user.profile.photoURL,
            email: this.form.value.email,
            providerId: this.form.value.providerId,
            key: this.user.profile.key,
        }
        this.user.editUser( data.key, data )
        .then( ( res ) => {
            this.error.message = 'Successfully Updated';
        } )
        .catch( e => {
            console.log(e.message)
            // this.shared.errorWrap(e.message)
        } )
    }

    closeAlert() {
        this.error.message = null;
    }

}