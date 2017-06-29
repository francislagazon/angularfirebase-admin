import * as firebase from 'firebase/app';
import { ERROR } from '../error/error';

import {
    USERS_PATH, USER, USERS, USER_REGISTER, USER_REGISTER_RESONSE
} from './../../model/user/user.interface';


export class UserData {
    debugPath: string = ''; // debug path.
    lastErrorMessage: string = '';
    constructor(public root: firebase.database.Reference) {

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

    get getLastErrorMessage(): string {
        let re = this.lastErrorMessage;
        this.lastErrorMessage = '';
        return re;
    }

    isEmpty(category) {
        return category === void 0 || !category;
    }
    error(e) {
        return firebase.Promise.reject(new Error(e));
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

    path(p: string) {
        p = this.debugPath + p;
        // console.log(`path: ${p}`);
        return p;
    }

    ////////////////////////////////////
    ////
    ////    User
    ////
    ////////////////////////////////////




    setLastErrorMessage(m) {
        this.lastErrorMessage = m;
        // console.log('------> ERROR: ', m);
    }

    editUser(key: string, data: USER): firebase.Promise<any> {
        if (this.isEmpty(key)) return this.error(ERROR.user_id_empty);
        if (this.checkKey(key)) return firebase.Promise.reject(new Error(ERROR.malformed_key));
        if (Object.keys(data).length === 0 || data === void 0) return this.error(ERROR.user_data_empty);
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
                    this.setLastErrorMessage(`User ${user} does not exist.`);
                    return firebase.Promise.reject(new Error(ERROR.user_not_exist));
                }
            });
    }

    userData(key?: string): firebase.database.Reference {
        if (this.isEmpty(key)) return this.root.ref.child(this.userDataPath);
        else return this.root.ref.child(this.userDataPath).child(key);
    }
    
    get userDataPath(): string {
        return this.path(USERS_PATH);
    }

}
