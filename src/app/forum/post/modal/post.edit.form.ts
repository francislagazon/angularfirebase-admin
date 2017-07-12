import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    ApiService,
    USER,
    POST, POSTS,
    CATEGORY, CATEGORIES,
    UserService,
    ForumService
} from './../../../../firebase-backend/firebase-backend.module';

@Component({
    selector: 'post-edit-modal',
    templateUrl: './post.edit.form.html'
})

export class PostEditForm implements OnInit {
    
    form: FormGroup;
    option: POST;
    categories: CATEGORIES = [];    
    postError = {
        message: '' 
    }

    postForm: POST = {
        uid: '',
        name: '',
        categories: <any>{},
        subject: '',
        content: '',
        photoUrl: ''
    };

    constructor(
        public forum: ForumService, 
        private api: ApiService,
        public activeModal: NgbActiveModal, 
        private fb: FormBuilder, 
        private user: UserService,
    ) {
        api.setBackendUrl( 'https://us-central1-forum-test-9f0a8.cloudfunctions.net/postApi' );    
    }

    formLoad() {
        
        /**
         *  Initialized the Categories 
         */

        this.listenCategory();

        /**
         *  Initialized the Form 
         */

        this.form = this.fb.group({
            subject: [this.option.subject, Validators.required],
            content: [this.option.content, Validators.required],
            categories: [this.option.categories]
        });
        
    }
    /*
    *   List all categories to load on the form
    *
    *
    */

    listenCategory() {
        this.forum.observeCategory().subscribe(res => {
            this.categories = res;
            
        });
    }
    
    onChangeFormCategory($event) {
        let checked = $event.target.checked;
        let value = $event.target.value;
        let categoryArray = this.form.get('categories').value;
        if (checked) { // add
            categoryArray.push(value);
        }
        else { // remove
            categoryArray = categoryArray.filter(v => v !== value)
        }
        this.form.get('categories').setValue(categoryArray);
    }
    
    checked( id ) {
        if (this.option.categories.findIndex(v => v == id) !== -1) return true;
    }
  
    onSubmitPostForm() {

        if(this.form.value.subject == "") {
            return this.postError.message = "Subject is missing";
        }
        
        this.postForm = {
            uid:  this.option.uid,
            key:  this.option.key,
            name:  this.option.name,
            categories: this.form.value.categories,
            subject: this.form.value.subject,
            content: this.form.value.content,
            secret: this.user.secretKey,
            function: 'edit'
        };

        console.log("POST FORM", this.postForm);
        this.api.post( this.postForm ).subscribe( key => {
            this.activeModal.close();
        }, e => {
            console.log(e);
            this.postError.message = "Category is empty";
        });

    }
    ngOnInit() {
        this.formLoad();
    }

}