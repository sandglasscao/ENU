import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {Taxpayer} from '../dashboard/taxpayer';


@Injectable()
export class CertifyTxprService {
    private baseUrl = 'api/users/taxpayer/';  // URL to web api
    constructor(private http: Http,
    private _cookieService: CookieService) { }

    updateTaxpayer(id: number, dict: {}): Promise<Taxpayer> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.patch(this.baseUrl + id, JSON.stringify(dict), {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any) {
    	console.error(error);
    	return Promise.reject(error._body);
  	}

}