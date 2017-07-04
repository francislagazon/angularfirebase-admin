import { Component, EventEmitter } from "@angular/core";
import * as firebase from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SharedService, IAlert } from './../../provider/shared.service';

import {
    ApiService,
    UserService,
    CATEGORY, CATEGORIES,
    ForumService
} from './../../../firebase-backend/firebase-backend.module';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-category',
    templateUrl: './category.html'
})

export class Category {
    category_id: string;
    category_name: string;
    categories: CATEGORIES = [];

    page = 1;
    pager: any = {};
    pagedItems: any[];
    pageSize: number;
    nooflist: number = 5;

    error: IAlert = {
        message: '',
        type: 'success'
    };

    category : CATEGORY = { 
        function: '', 
        id: '', 
        name: '',
        description: '',
        uid: '',
    };

    form: FormGroup;

    constructor(
        private api: ApiService,
        public forum: ForumService,
        public user: UserService,
        private shared: SharedService,
        private fb: FormBuilder
    ) {
            this.initializedForm();
            this.api.setBackendUrl( 'https://us-central1-forum-test-9f0a8.cloudfunctions.net/categoryApi' );
            this.listenCategory();
    }

    /* 
    *   Initialize the Form 
    *
    */

    initializedForm() {
        this.form = this.fb.group({
            id:            ['', Validators.required],
            name:          ['', Validators.required]
        });
    }

    /* 
    *   List All Categories
    *   Pagination
    *
    */

    listenCategory() {
        this.forum.getCategories()
            .then( data => {
                this.categories = data
                this.setPage(1);
            })
            .catch( e => {
                this.error = this.shared.errorWrap(e.message);
            });
    }

    /* 
    *   Create Category
    *
    */

    onClickCreateCategory() {

        this.forum.createCategory( { id: this.form.value.id, name: this.form.value.name, uid: this.user.uid } )
        .then( key => {
            this.initializedForm();
            this.error.message = "Success!!!";
            this.listenCategory()
        } )
        .catch( e => {
            this.error = this.shared.errorWrap(e.message);
        } )
        
    }
    
    /* 
    *   Edit Category by ID
    *
    */

    onClickCategoryEdit( id: string ) {
       
        let cat = this.categories.find(v => v.id == id);

        this.forum.editCategory( { id: cat.id, name: cat['name'], description: cat['description'], uid: this.user.uid } )
        .then( key => {
            this.error.message = "Successfully Save!!!";
            this.listenCategory()
        } )
        .catch( e => {
            this.error = this.shared.errorWrap(e.message);
        } )
    } 

    /* 
    *   Delete Category by ID
    *
    */

    onClickCategoryDelete( id: string ) {

        this.forum.deleteCategory( id )
        .then( () => {
            this.error.message = "Successfully Deleted!!!";
            this.listenCategory() 
        } )
        .catch( e => {
            this.error = this.shared.errorWrap(e.message);
        } )

    }

    /* 
    *   Preparing Pagination and
    *   Items
    *
    */

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.shared.getPager(this.categories.length, page, this.nooflist);
        this.pagedItems = this.categories.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    /* 
    *   Close Active Notification / Alert
    *
    */

    closeAlert() {
        this.error.message = null;
    }
}
