import { Component } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as firebase from 'firebase';

import { PostEditForm } from './modal/post.edit.form';

import {
  UserService,
  CATEGORY, CATEGORIES,
  POST, POSTS,
  ForumService,
  ApiService, TestService
} from '../../../firebase-backend/firebase-backend.module';

import { SharedService } from './../../provider/shared.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.html',
    styleUrls: ['./post.css']
})

export class PostComponent {

    categories: CATEGORIES = [];    
    post_error: string;
    postError = {
        message: '' 
    }

    action: string = "list";
    btnSubmit: boolean = true;

    postForm: POST = {
        uid: '',
        name: '',
        categories: <any>{},
        subject: '',
        content: '',
        photoUrl: '',
        secret: ''
    };

    posts: POSTS;

    private allItems: any[];
    
    postKeys: Array<string> = [];
    postData: { [key: string]: POST } = {};
    
    page = 1;
    pager: any = {};
    postItems: any[];
    pageSize: number;
    nooflist: number = 5;

    form: FormGroup;
    category: string;

    modalRef = null;
    loaderImg: boolean = false
    constructor(
        public forum: ForumService, 
        private api: ApiService, 
        public user: UserService, 
        private shared: SharedService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private route: ActivatedRoute
    ) {
        console.log("user.secretKey", user.secretKey)
        this.formLoad();
        
        api.setBackendUrl( 'https://us-central1-forum-test-9f0a8.cloudfunctions.net/postApi' );
        this.loadPosts();

    }

    formLoad() {
        
        /**
         *  Initialized the Form 
         */

        this.form = this.fb.group({
            subject: [],
            content: [],
            categories: [[]]
        });
        
        /**
         *  Initialized the Categories 
         */

        this.listenCategory();
    }

    /**
     *  Initialized the Posts 
     */

    loadPosts() {
        this.route.params
            .subscribe(param => {
                this.loaderImg = true;
                this.resetPosts();
                if (param['category']) {
                    this.category = param['category'];
                    this.loadPostsCategory(this.category)
                } else {
                    this.loadPostsCategory();
                 }
            });

    }

    resetPosts() {
        this.postKeys = [];
        this.postData = {};
    }
    
    loadPostsCategory(category?) {
        if(!category) category = "all-categories";
        let o = {
            ref: this.forum.categoryPostRelation(category),
            keyOnly: true
        };
        this.forum.page(o)
            .then(x => this.renderPage(o, x))
            .catch(e => console.log(e));
    }

    renderPage(o, posts: Array<string>) {
        this.loaderImg = false;
        let re = this.forum.pageHelper(o, posts);
        posts = re.posts;
        posts.map(key => this.addPostAtBottom(key));
    }

    addPostAtBottom(key: string, post?: POST) {
        this.postKeys.push(key);
        
        this.updatePost(key, post);

        if (post) this.postKeys[key] = post;
        else {
            this.forum.postData(key).once('value').then(s => {
                
                let post: POST = s.val();
                this.postData[key] = post;
                console.log("this.postKeys", this.postData)
            });
        }
    }
    updatePost(key, post) {
        if (post) this.postData[key] = post;
        else if (key) {
            this.forum.postData(key).once('value').then(s => {
                this.postData[key] = s.val();
            });
        }
        else console.error("updatePost() key and post are empty");
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.shared.getPager(this.categories.length, page, this.nooflist);
        this.postItems = this.posts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onChangeFormCategory($event) {
        console.log($event);
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

    onSubmitPostForm() {
        if(this.form.value.subject == "") {
            return this.postError.message = "Subject is missing";
        }
        
        this.postForm = {
            uid: this.user.uid,
            name: this.user.name,
            categories: this.form.value.categories,
            subject: this.form.value.subject,
            content: this.form.value.content,
            secret: this.user.secretKey,
            function: 'create'
        };

        this.api.post( this.postForm ).subscribe( key => {
            this.loadPosts();
            this.formLoad();
        }, e => {
            console.log(e.message);
        });
    }

    onClickEdit( post : POST ) {
        console.log(post);
        this.modalRef = this.modalService
        .open( PostEditForm );
        this.modalRef.componentInstance['option'] = post;

        this.modalRef.result.then(( res ) => {
           this.loadPosts();
        }, reason => {
            console.log(reason)
        });
    }

    onClickDelete( post : POST ) {

        let data = {
            uid: post.uid,
            key: post.key,
            secret: this.user.secretKey,
            function: 'delete'
        };
        this.api.post( data ).subscribe( key => {
        
        this.loadPosts();

        }, e => { console.log(e.message); });
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

    /*
    *   File Upload Function
    *
    *   Todo - Categorize the uploaded image to the storage
    *
    */

    onChangeFileUpload( fileInput ) {
        this.btnSubmit = false;
        let file = fileInput.files[0];

        let storageRef = firebase.storage().ref();
        let path = `/uploads/${this.user.uid}/${file.name}`;
        let iRef = storageRef.child(path);

        iRef.put(file).then((snapshot) => {
            this.btnSubmit = true;
            this.postForm.photoUrl = snapshot.downloadURL;
        });
    }

    /*
    *   Convert Timestamp into Real Time
    *
    */

    getMonths(month) {
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[month];
    }
}