import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Alert } from './alert/alert';
export { Alert } from './alert/alert';


import { AlertContent } from './alert/alert-content';
import { RouterModule } from '@angular/router';
// import { Confirm } from './confirm/confirm';
// import { ConfirmContent } from './confirm/confirm-content';


@NgModule({
  declarations: [
    AlertContent,
    // ConfirmContent
    ],
  entryComponents: [
    AlertContent,
    // ConfirmContent
    ],
  imports: [
    RouterModule,
    NgbModule.forRoot() // for ng-bootstrap registration
  ],
  exports: [ NgbModule ], // export alert for importing in other component.
  providers: [
    Alert,
    // Confirm
     ] // provide alert for injecting in other component.
})
export class BootstrapModule {}