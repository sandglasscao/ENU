import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {LoginService}  from './login.service';
import {Credential} from './credential';


@Component({
    selector: 'login-form',
    templateUrl: 'static/app/templates/login.html',
    // directives: [RouterLink],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        LoginService,
    ]
})
export class LoginComponent {

    model = new Credential();
    error = null;
    isWcodeValid = true;

    constructor(private loginService: LoginService,
                private router: Router) {
    }

    onSubmit() {
        if (this.model.username) {
            if (this.model.username.substring(0, 1) != "1"
                && this.model.username.substring(0, 1) != "5"
                && this.model.username.substring(0, 1) != "9") {
                this.error = "用户编码格式错误!";
            } else {
                this.loginService
                    .login(this.model)
                    .then(credential => {
                        // this.model = credential;
                        sessionStorage.setItem('token', credential.token);
                        sessionStorage.setItem('weidcode', this.model.username);
                        sessionStorage.setItem('usertype', this.model.username.substring(0, 1))
                        this.router.navigate(['/dashboard']);
                    })
                    .catch(error => {
                        // this.error = error;
                        this.error = "用户编码或密码错误!"
                    }); // TODO: Display error message
            }
        }
    }

    cleanerror() {
        this.error = null;
    }
}