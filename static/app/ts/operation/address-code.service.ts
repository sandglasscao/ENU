import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AddressCodeService {
    private addrCodeUrl = 'api/opt/addrcode';  // URL to web api addrcode

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    refresh(url: string): Promise<any> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        let body = {'url': url};
        return this.http.post(this.addrCodeUrl + '/refresh', body, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    uploadFile(file: File): Promise<boolean> {
        let formData = new FormData();
        formData.append('addrfile', file);
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.addrCodeUrl, formData, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error(error);
        return Promise.reject(error._body);
    }
}