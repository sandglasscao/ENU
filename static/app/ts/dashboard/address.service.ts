import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';
import {Address} from './address';

@Injectable()
export class AddressService {
    private basicUrl = 'api/users/addresses/';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    addAddress(address: Address): Promise<Address> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.basicUrl, JSON.stringify(address), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    delAddress(addressid: number) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        //return this.http.delete(this.basicUrl+"/"+addressid+"/delete",{headers: headers})
        return this.http.delete(this.basicUrl + addressid, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    listAddresses(): Promise<Address[]> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.get(this.basicUrl, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}