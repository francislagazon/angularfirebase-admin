import { Component, Input } from "@angular/core";
import * as firebase from 'firebase/app';
import { Router} from '@angular/router';

import { SharedService, IAlert } from './../../provider/shared.service';

import {
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

    pager: any = {};
    pagedItems: any[];
    pageSize: number;
    nooflist: number = 5;

    alerts: IAlert = {
        message: '',
        type: '',
        active: false
    }

    constructor(
        public forum: ForumService,
        public user: UserService,
        private router: Router,
        private shared: SharedService) {
            this.listenCategory();
    }

    /* 
    *   Create Category
    *
    */

    onClickCreateCategory() {
        console.log(`Create: ${this.category_name}`);
        let category = { id: this.category_id, name: this.category_name };
        this.forum.createCategory(category)
            .then( id => { } )
            .catch( e => {
                this.alerts.active = true;
                this.alerts.message = 'Category Exist';
                this.alerts.type = "danger";  
            });
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
    *   Edit Category by ID
    *
    */

    onClickCategoryEdit( id: string ) {
        let cat = this.categories.find(v => v.id == id);
        let category = { 
            id: cat.id, 
            name: cat['name'], 
            description: cat['description'] 
        };

        this.forum.editCategory(category)
            .then(id => {
                this.alerts.active = true;
                this.alerts.message = `ID #${id} has been updated`;
                this.alerts.type = "success";
            })
        .catch(e => this.category_error = e.message);
    } 

    /* 
    *   Delete Category by ID
    *
    */

    onClickCategoryDelete( id: string ) {
        this.forum.deleteCategory(id)
        .then(() => {
            this.alerts.active = true;
            this.alerts.message = `ID #${id} has been deleted`;
            this.alerts.type = "success";
         })
        .catch(e => this.category_error = e.message);
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
        this.alerts.active = false;
    }
}
