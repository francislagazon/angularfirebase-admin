import { Component } from "@angular/core";
import {
  UserService
} from '../../../firebase-backend/firebase-backend.module';

import * as firebase from 'firebase/app';

@Component({
    selector: 'app-header',
    templateUrl: './header.html'
})

export class Header {  
    
    constructor( public user: UserService ) {}

    /*
    *   Create / Login using Google Auth  
    *
    */

    onClickLoginWithGoogle() {
        this.user.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() )
            .then((res) => {
                console.log(res);
             })
            .catch(e => {
                console.log('error: ', e);
            });
    }

    /*
    *   Create / Login using Facebook Auth  
    *
    */

    onClickLoginWithFacebook() {
        this.user.auth.signInWithPopup( new firebase.auth.FacebookAuthProvider() )
            .then((res) => { })
            .catch(e => {
                console.log('error: ', e);
            });
    }
}