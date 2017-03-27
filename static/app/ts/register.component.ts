import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {RegisterService}  from './register.service';

import {Register}  from './register';
import {NiceWeidcodeComponent} from './nice-weidcode.component';

@Component({
    selector: 'reg-form',
    templateUrl: 'static/app/templates/registration.html',
    directives: [ROUTER_DIRECTIVES, NiceWeidcodeComponent],
    providers: [
        RegisterService,

    ]
})
export class RegisterComponent {
    isEnterprise = false;
    isThird = false;
    isSuccess = false;
    active = true;
    isAgree = false;
    isCellExisted = false;
    isPasswd2 = true;
    showNiceWeidcode = false;

    error = {};
    results = [];
    otypes = [
        {"code": 0, "name": ""},
        {"code": 0, "name": "物流快递"},
        {"code": 1, "name": "金融机构"},
        {"code": 2, "name": "保险机构"},
    ];

    model = new Register();

    constructor(private registerService: RegisterService,
                private router: Router) {
    }



    ngOnInit() {
        this.model.usertype = 1;
    }

    cancel() {
        console.log('cancel registration');
        this.model = new Register();
    }

    checkCell(cell) {
        console.log(cell);
        if (cell == undefined || cell == null) {

        }
        this.registerService.checkExistedCell(this.model)
            .then(profiles => {
                    if (profiles.length == 1) {
                        this.isCellExisted = true;
                    } else {
                        this.isCellExisted = false;
                    }
                }
            )
    }

    checkPassword2(pwd) {
        console.log(pwd);
        if (pwd != this.model.password) {
            this.isPasswd2 = false;
        }
    }

    chooseWeidcode() {
        console.log("choose a nice weidcode");
        this.showNiceWeidcode = true;
    }

    onSelectUserType(userType) {
        this.model.usertype = userType;
        if (userType == 9) {
            this.isEnterprise = true;
            this.isThird = false;
        } else if (userType == 5) {
            this.isThird = true;
            this.isEnterprise = false;
        } else {
            this.isEnterprise = false;
            this.isThird = false;
        }
    }

    onSubmit() {
        console.log(this.model);
        this.active = false;

        this.save();


    }

    removePwdAlert() {
        this.isPasswd2 = true;
    }

    save() {
        this.registerService
            .save(this.model)
            .then(register => {
                this.model = register;
                sessionStorage.setItem('token', register.token);
                sessionStorage.setItem('weidcode', register.weidcode);
                sessionStorage.setItem('usertype', register.weidcode.substring(0, 1));
                this.isSuccess = true;
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    weidcodeChosed(value) {
        this.showNiceWeidcode = value['show'];
        this.model.weidcode = value['weidcode'];
    }
}
