import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {Profile} from './profile';
import {ProfileService}  from './profile.service';
import {WizardService} from '../wizard/wizard.service';

@Component({
    templateUrl: 'static/app/templates/dashboard/contact.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ProfileService,
        WizardService
    ]
})
export class ContactComponent implements OnInit {
    profile = new Profile();

    constructor(private profileService: ProfileService,
                private router: Router,
                private wizardService: WizardService) {
    }

    cancel() {
        this.foreward();
    }

    ngOnInit() {
        this.profileService.retrieveProfile(sessionStorage.getItem("weidcode"))
            .then(res => this.profile = res)
            .catch(error => console.log(error))
    }

    onSubmit() {
        //console.log("save contact information")
        this.profileService.updateProfile(this.profile)
            .then(res => {
                this.profile = res;
                this.foreward();
            })
            .catch(error => console.log(error));
    }

    private foreward() {
        this.router.navigate([this.wizardService.nextStep(this.router.url)]);
    }
}