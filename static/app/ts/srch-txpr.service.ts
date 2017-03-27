import { Injectable }     from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import { Taxpayer } from './dashboard/taxpayer';

@Injectable()
export class SrchTxprService {
    private baseUrl = 'api/users/srch-txpr/';  // URL to web api
    constructor(private http: Http,
    private _cookieService: CookieService) { }    
    
    search(keyword: string): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));  
      	return this.http.get(this.baseUrl + keyword, {headers: headers})
        //return this.http.get(this.baseUrl, {headers: headers})
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
    }

    paginate(link: string){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
      	return this.http.get(link, {headers: headers})
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
    }
        
  	private handleError(error: any) {
    	console.error(error);
    	return Promise.reject(error._body);
  	}

}