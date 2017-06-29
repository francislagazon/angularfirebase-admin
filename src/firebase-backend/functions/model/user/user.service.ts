import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import { Router} from '@angular/router';
import { ERROR } from '../error/error';
import { UserData } from './user';
import {
    USERS_PATH, USER, USERS, USER_REGISTER, USER_REGISTER_RESONSE
} from './user.interface';


@Injectable()
export class UserService extends UserData {
    auth: firebase.auth.Auth;
    private _isAdmin: boolean = false;
    root: firebase.database.Reference;
    debugPath: string = '';
    lastErrorMessage: string = '';
    constructor(
        
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        private router: Router
    ) {
        super( angularFireDatabase.database.ref('/'));
        this.auth = angularFireAuth.auth;
         
        /**
         * For admin check.
         */
        this.auth.onAuthStateChanged( (user: firebase.User) => {
            console.log("Auth state changed");
            if ( user ) {
                console.log("User logged in");
            }
            else {
                console.log("User logged out");
            }
            this.checkAdmin();
        }, e => {

        });


    }

    path(p: string) {
        p = this.debugPath + p;
        // console.log(`path: ${p}`);
        return p;
    }

    isEmpty(user) {
        return user === void 0 || !user;
    }

    error(e) {
        return firebase.Promise.reject(new Error(e));
    }

    /**
     * Checks if the push key has in right form.
     * @param key The push key
     * @return true on error. false on success.
     */
    checkKey(key: string): boolean {
        if (key === void 0 || !key) return true;
        // if (key.length != 21) return true; // key can be made by user.
        if (key.indexOf('#') != -1) return true;
        if (key.indexOf('/') != -1) return true;
        if (key.indexOf('.') != -1) return true;
        if (key.indexOf('[') != -1) return true;
        if (key.indexOf(']') != -1) return true;
        return false;
    }

    userData(key?: string): firebase.database.Reference {
        if (this.isEmpty(key)) return this.root.ref.child(this.userDataPath);
        else return this.root.ref.child(this.userDataPath).child(key);
    }

    /**
     * GETTERS
     */
    get uid() {
         if ( this.isLogged ) return this.auth.currentUser.uid;
    }
    get name() {
         if ( this.isLogged ) return this.auth.currentUser.displayName;
    }

    get userDataPath(): string {
        return this.path(USERS_PATH);
    }

    /// eo GETTERS

    /**
     * 
     * @param data 
     */
    create(data: USER_REGISTER): Promise<firebase.User> {
        return <Promise<firebase.User>><any>this.auth.createUserWithEmailAndPassword(data.email, data.password);
    }

    update(user: firebase.User, data: USER_REGISTER ) : firebase.Promise<void> {
        return user.updateProfile({
                    displayName: data.displayName,
                    photoURL: data.photoUrl
                });
    }
    
    editUser(key: string, data: USER): firebase.Promise<any> {
        if (this.isEmpty(key)) return this.error(ERROR.user_id_empty);
        if (this.checkKey(key)) return firebase.Promise.reject(new Error(ERROR.malformed_key));
        return this.userExists(key).then(re => {
            return this.setUser(key, data);
        });
    }

    /**
     * 
     * @param data User data.
     * @param key User key
     * 
     * @return Promise
     * 
     *      on success, promies with category id
     *      on error, .catch() will be invoked.
     * 
     */
    setUser(key: string, data: USER): firebase.Promise<any> {

        if (this.isEmpty(key)) return this.error(ERROR.category_id_empty);

        data = this.undefinedToNull(data);


        // console.log("edit Category data: ", data);
        return this.userData(key).update(data).then(() => key);
    }

    /**
     * 
     * @note Callback style function
     * 
     * @param data - user registration data.
     * @param success 
     * @param error 
     */
    register( data: USER_REGISTER, success, error ) {

        this.create( data )
            .then( user => this.update( user, data ) )
            .then( success )
            .catch( error );

    }

    logout() {
        this.auth.signOut().then(()=>{
            console.log("sign out ok");
        }, () => {
            console.log("sing out error");
        });
    }

    /**
     * 
     */
    get isLogged() : boolean {
        if (this.auth.currentUser === void 0 ) return false;
        return this.auth.currentUser !== null;
    }

    get isAdmin() : boolean {
        return this._isAdmin;
    }

    /**
     * 
     * @param user 
     * 
     * @return
     *      on sucess, promise with true.
     */
    userExists(user: string): firebase.Promise<any> {
        return this.userData(user).once('value')
            .then(s => {
                if (s.val()) return true;
                else {
                    this.setLastErrorMessage(`Category ${user} does not exist.`);
                    return firebase.Promise.reject(new Error(ERROR.user_not_exist));
                }
            });
    }

    /**
     * checks if the logged in user is admin.
     */
    checkAdmin() {
        if ( ! this.isLogged ) {
            console.log("checkAdmin() not logged");
            this._isAdmin = false;
            return;
        }
        console.log("Admin check");
        this.root.child('admin').child( this.uid ).once('value').then( s => {
            let re = s.val();
            console.log(`${this.uid} is admin ? ${re}`);
            if ( re === true ) this._isAdmin = true;
         });
    }

    /**
     * 
     * Turns undefined into null to avoid "first argument contains undefined in property firebase" error.
     * 
     * @param obj 
     * 
     * @code
     *              data = this.database.undefinedToNull( data );
     * @endcode
     * 
     */
    undefinedToNull(obj) {
        obj = JSON.parse(JSON.stringify(obj, function (k, v) {
            if (v === undefined) return null;
            else return v;
        }));
        return obj;
    }

    setLastErrorMessage(m) {
        this.lastErrorMessage = m;
        // console.log('------> ERROR: ', m);
    }


}