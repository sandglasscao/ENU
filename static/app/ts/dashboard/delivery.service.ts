import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {Freight} from './freight';
import {MetaType } from '../metadata/metatype';
import {User} from "../user";

@Injectable()
export class DeliveryService {
    private basicUrl = 'api/users/delivery/';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
     }

    listShippers(): Promise<User[]> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        let url = this.basicUrl + 'shipper';
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    save(formData: FormData): Promise<Freight> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.basicUrl, formData, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}