import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';
import { Register } from './register'
import { Credential } from "./credential"

@Injectable()
export class RegisterService {
    private registersUrl = 'api/users/register';  // URL to web api
    constructor(private http: Http,
    private _cookieService: CookieService) { }
    save(register: Register): Promise<Register>  {
        // if (register.id) {
        //   return this.put(register);
        // }
        return this.post(register);
    }
    
    // Add new Register
    private post(register: Register): Promise<Register> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        return this.http
                   .post(this.registersUrl, JSON.stringify(register), {headers: headers})
                   .toPromise()
                   .then(res => res.json())
                   .catch(this.handleError);
    }
    checkExistedCell(register : Register): Promise<Register[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));        
        return this.http.post(this.registersUrl+"/checkcell", JSON.stringify(register), {headers: headers})
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }  
    private handleError(error: any) {
        console.error(error);
        return Promise.reject(error._body);
    }
}