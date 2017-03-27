import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';
import { Credential } from "./credential"

@Injectable()
export class LoginService {

    constructor(private http: Http,
    private _cookieService: CookieService) { }
    
    login(credential:Credential): Promise<Credential>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        return this.http
                  .post("/login/", JSON.stringify(credential), {headers: headers})
                  .toPromise()
                  .then(res => res.json())
                  .catch(this.handleError);        
    }
   
    private handleError(error: any) {
        console.error(error);
        return Promise.reject(error._body);
    }    
}