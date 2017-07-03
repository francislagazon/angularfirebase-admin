import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { UserComponent } from './user/user';
import { UserEditForm } from './user/modal/user.edit.form';
import { Trash } from './user/trash/trash';

import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

import { Dashboard } from './forum/dashboard/dashboard';
import { Category } from './forum/category/category';

import { SharedService } from './provider/shared.service';

import { environment } from '../environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseBackendModule } from './../firebase-backend/firebase-backend.module';


const appRoutes:Routes = [
  { path: "", component: Dashboard },
  { path: "category", component: Category },
  { path: "users", component: UserComponent },
  { path: "users/trash", component: Trash }
];

@NgModule({
  declarations: [
    AppComponent,
    Header,
    Sidebar,
    Dashboard,
    Category,
    UserComponent,
    UserEditForm,
    Trash
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash : false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FirebaseBackendModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent],
  entryComponents: [UserEditForm]
})
export class AppModule { }
