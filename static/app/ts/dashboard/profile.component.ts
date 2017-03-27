import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {ProfileService}  from './profile.service';

import {Profile} from './profile';
import {Individual} from './individual';
import {Enterprise} from './enterprise';
import {Orgnization} from './orgnization';
import {WizardService} from '../wizard/wizard.service';

@Component({
    templateUrl: 'static/app/templates/dashboard/profile.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ProfileService,
        WizardService
    ]
})
export class ProfileComponent implements OnInit {
    lbls = {
        1: ['昵称', '姓名', '证件类型', '证件号码'],
        5: ['', '', '', ''],
        9: ['单位名称', '单位全称', '证照名称', '证照号码']
    };

    model = new Profile();

    isEnterprise = false;
    isIndividual = false;
    isOrgnization = false;
    isSuccess = false;

    idtypes = [{
        "code": 1,
        "name": "身份证"
    },
        {
            "code": 2,
            "name": "护照"
        }
    ];

    id_name_lbl: string;    // identity name label for enterprise/orgnization
    id_no_lbl: string;  //identity number label for enterprise/orgnization
    name_lbl: string;   //full name label
    name2_lbl: string;  //nick name or shortname label of enterprise/orgnization
    error = null;

    constructor(private router: Router,
                private profileService: ProfileService,
                private wizardService: WizardService) {
    }

    cancel() {
        this.foreward();
    }

    ngOnInit() {
        this.model.individual = new Individual();
        this.model.enterprise = new Enterprise();
        this.model.orgnization = new Orgnization();
        this.profileService.retrieveProfile(sessionStorage.getItem("weidcode"))
            .then(profile => {
                if (profile.address)
                    sessionStorage.setItem('defaultaddress', profile.address.id.toString());
                this.model = profile;
                //console.log("init :" + JSON.stringify(this.model));
                if (profile.usertype == 1) {
                    this.isIndividual = true;

                } else if (profile.usertype == 9) {
                    this.isEnterprise = true

                } else if (profile.usertype == 5) {
                    this.isOrgnization = true
                }
                this.set_lbls();
            })
            .catch(error => console.log(error))
    }

    onSubmit() {
        this.profileService.updateProfile(this.model)
            .then(profile => {
                this.foreward();
                this.isSuccess = true;
                // let nextUrl = sessionStorage.getItem("nextUrl");
                // if (nextUrl) {
                //     console.log('navigate to ' + nextUrl);
                //     sessionStorage.setItem('nextUrl', null);
                //     this.router.navigate([nextUrl]);
                // } else {
                //     this.isSuccess = true;
                // }
            })
            .catch(error => console.log(error))
    }

    private foreward() {
        this.router.navigate([this.wizardService.nextStep(this.router.url)]);
    }

    private set_lbls() {
        this.name2_lbl = this.lbls[this.model.usertype][0];
        this.name_lbl = this.lbls[this.model.usertype][1];
        this.id_name_lbl = this.lbls[this.model.usertype][2];
        this.id_no_lbl = this.lbls[this.model.usertype][3];
    }
}

