import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {AddressComponent} from './address.component';
import {TaxpayerComponent} from './taxpayer.component';
import {DeliveryComponent} from './delivery.component';
import {GrossCheckComponent} from './gross-check.component';
import {NotificationComponent} from './notification.component';
import {WelcomeComponent} from './welcome.component';


@Component({
    templateUrl: 'static/app/templates/dashboard/dashboard.html',
    // directives: [RouterLink],
    directives: [ROUTER_DIRECTIVES],

    providers: [],
    precompile: [
        AddressComponent,
        TaxpayerComponent,
        DeliveryComponent,
        GrossCheckComponent,
        NotificationComponent,
        WelcomeComponent,
    ]
})
export class DashboardComponent {
    constructor(private router: Router) {
    }

    userType = sessionStorage.getItem('usertype');

    logout() {
        console.log("user logout!");
        sessionStorage.removeItem('token');
        this.router.navigate(['/']);
    }
}