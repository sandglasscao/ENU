import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {NiceWeidcodeRegex} from './nicwdcd-regex';


@Injectable()
export class NicwdcdRegexService {
    private basicUrl = 'api/opt/nicwdcd';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    addRegex(nicwdcdRegex: NiceWeidcodeRegex): Promise<NiceWeidcodeRegex> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.basicUrl, JSON.stringify(nicwdcdRegex), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    delRegex(nicwdcdRegexid: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.delete(this.basicUrl + "/" + nicwdcdRegexid, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    listRegex(): Promise<NiceWeidcodeRegex[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.get(this.basicUrl, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error(error);
        return Promise.reject(error._body);
    }
}