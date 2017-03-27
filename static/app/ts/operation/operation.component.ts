import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {AddressCodeComponent} from './address-code.component';
import {CertifyTxprComponent} from './certify-taxpayer.component';
import {NicWdcdRegexComponent} from './nicwdcd-regex.component';
import {OptWelcomeComponent} from './opt-welcome.component';
import {SegmentComponent} from './segment.component';

@Component({
    templateUrl: 'static/app/templates/operation/operation.html',
    // directives: [RouterLink],
    directives: [ROUTER_DIRECTIVES],
    precompile: [
        AddressCodeComponent,
        CertifyTxprComponent,
        OptWelcomeComponent,
        SegmentComponent,
        NicWdcdRegexComponent,
    ],
})
export class OperationComponent {
    constructor(private router: Router) {
    }

    logout() {
        console.log("user logout!");
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
}