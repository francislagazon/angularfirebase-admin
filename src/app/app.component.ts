import { Component } from '@angular/core';
import { Http } from '@angular/http';
import {
  UserService
} from '../firebase-backend/firebase-backend.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public user: UserService) { }

}