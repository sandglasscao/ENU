import {Injectable}     from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {Notification} from './notification';

@Injectable()
export class NotificationService {
    private baseUrl = 'api/users/notify/';  // URL to web api
    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    delNote(id: number) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.delete(this.baseUrl + id, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    listNotifications(): Promise<Notification[]> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.get(this.baseUrl, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    updateNote(id: number, dict: {}): Promise<Notification> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.patch(this.baseUrl + id, JSON.stringify(dict), {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}