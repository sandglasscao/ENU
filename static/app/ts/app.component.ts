import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {LoginComponent} from './login.component';
import {ContactComponent} from './dashboard/contact.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register.component';
import {NiceWeidcodeComponent} from './nice-weidcode.component';
import {WizardComponent} from './wizard/wizard.component';
import {OperationComponent} from './operation/operation.component';
import {OptLoginComponent} from './operation/opt-login.component';
import {PasswordComponent} from './dashboard/password.component';
import {ProfileComponent} from './dashboard/profile.component';
import {HomeComponent} from './home.component';

@Component({
    selector: 'my-app',
    template: `

    <router-outlet></router-outlet>
  `,
    directives: [ROUTER_DIRECTIVES],
    precompile: [
        LoginComponent,
        ContactComponent,
        DashboardComponent,
        RegisterComponent,
        NiceWeidcodeComponent,
        WizardComponent,
        OperationComponent,
        OptLoginComponent,
        PasswordComponent,
        ProfileComponent,
        HomeComponent,
    ],
})
export class AppComponent {
}