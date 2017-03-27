import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import { Segment } from './segment';


@Injectable()
export class SegmentService {
    private basicUrl = 'api/opt/segment';  // URL to web api
    
    constructor(private http: Http,
        private _cookieService: CookieService) { }

    addSegment(segment: Segment): Promise<Segment> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.post(this.basicUrl, JSON.stringify(segment), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    delSegment(segmentid: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.delete(this.basicUrl + "/" + segmentid, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    listSegment(): Promise<Segment[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT "+ sessionStorage.getItem('token'));
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