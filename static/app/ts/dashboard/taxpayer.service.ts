import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {Taxpayer} from './taxpayer'

@Injectable()
export class TaxpayerService {
    private basicUrl = 'api/users/taxpayer/';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    addTaxpayer(formData: FormData): Promise<Taxpayer> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.basicUrl, formData, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    listTaxpayers(): Promise<any> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.get(this.basicUrl, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    updateTaxpayer(taxpayerid: number, formData: FormData): Promise<Taxpayer> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        let url = this.basicUrl + taxpayerid;
        return this.http.put(url, formData, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}