import { Component, EventEmitter } from "@angular/core";
import * as firebase from 'firebase/app';
import { Router} from '@angular/router';

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
    category_error: string;
    category_id: string;
    category_name: string;
    categories: CATEGORIES = [];

    page = 1;
    pager: any = {};
    pagedItems: any[];
    pageSize: number;
    nooflist: number = 2;

    alerts: IAlert = {
        message: '',
        type: '',
        active: false
    }
    category : CATEGORY = { 
        function: '', 
        id: '', 
        name: '',
        description: '',
        uid: '',
        
    };
    constructor(
        private api: ApiService,
        public forum: ForumService,
        public user: UserService,
        private router: Router,
        private shared: SharedService) {

            this.api.setBackendUrl( 'https://us-central1-forum-test-9f0a8.cloudfunctions.net/categoryApi' );
            this.listenCategory();

    }

    checkEdit() {
        // CHECK IF THE USER IS ADMIN

        if(this.user.isAdmin !== true) {
            this.alerts.active = true;
            this.alerts.message = `Only Administrator can access this page`;
            this.alerts.type = "danger";
            return false
        } else return true
    }
    /* 
    *   List All Categories
    *   Pagination
    *
    */

    listenCategory() {
        this.forum.observeCategory().subscribe(res => {
            console.log(res);
            this.categories = res;
            this.setPage(1);
        });
    }

    /* 
    *   List All Categories
    *
    */

    getCategories() {
        this.forum.getCategories()
        .then(categories => this.categories)
        .catch(e => this.category_error = e.message);
    }

    /* 
    *   Create Category
    *
    */

    onClickCreateCategory() {

        if( this.checkEdit() === false ) return ;
        console.log(`Create: ${this.category_name}`);
        
        this.category.function = 'create';
        this.category.id = this.category_id;
        this.category.name = this.category_name;
        this.category.uid = this.user.uid;

        this.api.post( this.category ).subscribe( key => { }, e => {
            this.alerts.active = true;
            this.alerts.message = 'Category is already Exist';
            this.alerts.type = "danger";
        });
    }
    
    /* 
    *   Edit Category by ID
    *
    */

    onClickCategoryEdit( id: string ) {

        if( this.checkEdit() === false ) return ;
       
        let cat = this.categories.find(v => v.id == id);
        console.log("cat", this.categories);
        
        this.category.function = 'edit';
        this.category.id = cat.id;
        this.category.name = cat['name'];
        this.category.description = cat['description'];
        this.category.uid = this.user.uid;

        this.api.post( this.category ).subscribe( key => {
        
            this.alerts.active = true;
            this.alerts.message = `ID #${id} has been updated`;
            this.alerts.type = "success";

        }, e => {
            this.alerts.active = true;
            this.alerts.message = e.message;
            this.alerts.type = "danger";
        });

    } 

    /* 
    *   Delete Category by ID
    *
    */

    onClickCategoryDelete( id: string ) {

        this.category.function = 'delete';
        this.category.id = id;
        this.category.uid = this.user.uid;

        this.api.post( this.category ).subscribe( key => {
        
            this.alerts.active = true;
            this.alerts.message = `ID #${id} has been deleted`;
            this.alerts.type = "success";

        }, e => {
            this.alerts.active = true;
            this.alerts.message = e.message;
            this.alerts.type = "danger";
        });
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
        this.pageSize = this.categories.length;
        console.log("Length", this.categories.length);
        console.log("Page", page);
        console.log("No of List", this.nooflist);
        this.pager = this.shared.getPager(this.categories.length, page, this.nooflist);
        this.pagedItems = this.categories.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    setPage2($event) {
        console.log($event);
    }
    /* 
    *   Close Active Notification / Alert
    *
    */

    closeAlert() {
        this.alerts.active = false;
    }
}
