import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {AddressComponent} from '../dashboard/address.component';
import {ContactComponent} from '../dashboard/contact.component';
import {ProfileComponent} from '../dashboard/profile.component';
import {TaxpayerComponent} from '../dashboard/taxpayer.component';
import {WizardService} from '../wizard/wizard.service';


@Component({
    templateUrl: 'static/app/templates/wizard/wizard.html',
    // directives: [RouterLink],
    directives: [ROUTER_DIRECTIVES],

    providers: [
        WizardService
    ],
    precompile: [
        AddressComponent,
        ContactComponent,
        ProfileComponent,
        TaxpayerComponent,
    ]
})
export class WizardComponent implements OnInit {
    titles = ["完善注册信息"];
    steps = ['profile', 'contact', 'address', 'taxpayer'];
    current_title = '完善注册信息';
    isFirst = true;

    constructor(private router: Router,
                private wizardService: WizardService) {
    }

    ngOnInit() {
        let currStep = this.steps.splice(0,1);
        sessionStorage.setItem('currstep', currStep.toString());
        sessionStorage.setItem('nextsteps', this.steps.toString());
        sessionStorage.setItem('presteps', '');
    }

    nextStep() {
        this.router.navigate([this.wizardService.nextStep(this.router.url)]);
        this.isFirst = false;
    }

    preStep() {
        this.router.navigate([this.wizardService.preStep()]);
        this.isFirst = (sessionStorage.getItem('presteps').length == 0) ? true : false;
    }
}