import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserEditForm } from './modal/user.edit.form';

import {
  UserService,
  USER, USERS,
  ForumService
} from './../../firebase-backend/firebase-backend.module';

import { SharedService, IAlert } from './../provider/shared.service';


@Component({
    selector: 'user-component',
    templateUrl: './user.html'
})

export class UserComponent {
    trash: boolean = false;

    users: USERS = [];
    page = 1;
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

    error: IAlert = {
        message: '',
        type: 'success'
    };

    constructor(
        public user: UserService, 
        private shared: SharedService, 
        private modalService: NgbModal
        ) {
            this.loadUsers();
    }

    /* 
    *   List All Active Users
    *   Pagination
    *
    */

    loadUsers() {
        this.users = [];
        this.user.userData()
        .orderByChild('trash').equalTo(false)
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

        this.modalRef.result.then( (res) => { }, reason => { } );

    }

    /* 
    *   Delete User by key
    *
    */

    onClickDelete( key : string) {
        let data: USER = {
            trash: true
        }
        this.user.editUser(key, data)
        .then(res => {
            // Success will reload Users listing and show alert on the page
            this.loadUsers();
            this.error.message = 'User has been moved to the trash';
        })
        .catch( e => {
            this.error = this.shared.errorWrap( e.message );
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
        this.pager = this.shared.getPager(this.users.length, page, this.nooflist);
        this.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    /* 
    *   Close Active Notification / Alert
    *
    */

    closeAlert() {
        this.error.message = null;
    }
}
