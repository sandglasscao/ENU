import { Component } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { OptLoginService }  from './opt-login.service';
import { Credential } from '../credential';


@Component({
  selector: 'opt-form',
  templateUrl:'static/app/templates/operation/opt-login.html',
  // directives: [RouterLink],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    OptLoginService,
  ]
})
export class OptLoginComponent {
    credential = new Credential();
    error: string;

    constructor(
        private optLoginService: OptLoginService,
        private router: Router
    ) {  }
    onSubmit(){
        this.optLoginService
            .login(this.credential)
            .then(credential => {
                sessionStorage.setItem('token', credential.token);
                sessionStorage.setItem('weidcode', this.credential.username)
                this.router.navigate(['/opt']);
            })
            .catch(error => this.error = error);
    }
}