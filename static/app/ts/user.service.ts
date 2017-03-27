import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';
import {User} from './user'

@Injectable()
export class UserService {
    private profilesUrl = 'api/users';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    changePassword(user: User): Promise<User[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.put(this.profilesUrl + "/changepwd", JSON.stringify(user), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}