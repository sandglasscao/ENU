import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';
import {Profile} from './profile'

@Injectable()
export class ProfileService {
    private profilesUrl = 'api/users/';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    // checkExistedCell(profile : Profile): Promise<Profile[]> {
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));        
    //     return this.http.post(this.profilesUrl+"/profile", JSON.stringify(profile), {headers: headers})
    //           .toPromise()
    //           .then(response => response.json())
    //           .catch(this.handleError);
    // }

    retrieveProfile(weidcode: string): Promise<Profile> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        let url = this.profilesUrl + weidcode;
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    updateProfile(profile: Profile): Promise<Profile> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        //return this.http.put('api/users/'+sessionStorage.getItem("weidcode"),JSON.stringify(profile), {headers: headers})
        let url = this.profilesUrl + sessionStorage.getItem("weidcode");
        return this.http.put(url, JSON.stringify(profile), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}