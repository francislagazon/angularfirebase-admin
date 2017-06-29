import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserEditForm } from './../modal/user.edit.form';

import {
  UserService,
  USER, USERS,
  ForumService
} from './../../../firebase-backend/firebase-backend.module';

import { SharedService, IAlert } from './../../provider/shared.service';


@Component({
    selector: 'trah-component',
    templateUrl: './../user.html'
})

export class Trash {
    trash: boolean = true;

    users: USERS = [];

    pager: any = {};
    pagedItems: any[];
    pageSize: number;
    nooflist: number = 5;

    modalRef = null;

    userModal: USER = {
        uid: '',
        name: '',
        email: ''
    }

    alerts: IAlert = {
        message: '',
        type: '',
        active: false
    }
    constructor(
        public user: UserService, 
        private shared: SharedService, 
        private modalService: NgbModal
        ) {
            this.loadUsers();
    }

    /* 
    *   List All Non Active / Deleted Users
    *   Pagination
    *
    */

    loadUsers() {
        this.users = [];
        this.user.userData()
        .orderByChild('trash').equalTo(true)
        .once('value')
        .then( s => {
            let obj = s.val();
            if(obj) {
                for( let k of Object.keys( obj ) ) {
                    let d = obj[k];
                    d['key'] = k;
                    this.users.unshift( d );
                }
            }
            this.setPage( 1 );
        });
    }

    /* 
    *   Edit User using Modal
    *
    */

    onClickEdit( user: USER ) {
        this.modalRef = this.modalService
        .open( UserEditForm );
        this.modalRef.componentInstance['option'] = user;

        this.modalRef.result.then((res)=> {
           this.loadUsers();
        }, reason => {
            console.log(reason)
        });

    }

    /* 
    *   Restore User by key
    *
    */

    onClickRestore( key ) {
        let data: USER = {
            trash: false
        }
        this.user.editUser(key, data)
        .then(res => {
            
            // Success will reload Users listing and show alert on the page
            this.loadUsers();
            this.alerts.active = true;
            this.alerts.message = 'User has been restored';
            this.alerts.type = "success";
        })
        .catch(e => console.log(e.message))
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
        
        this.pager = this.shared.getPager(this.users.length, page, this.nooflist);
        this.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    /* 
    *   Close Active Notification / Alert
    *
    */
    
    closeAlert() {
        this.alerts.active = false;
    }
}
