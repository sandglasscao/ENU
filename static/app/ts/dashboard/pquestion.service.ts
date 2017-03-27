import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/toPromise';

import {Pquestion} from './pquestion'

@Injectable()
export class PquestionService {
    private pqsUrl = 'api/users/pqs';  // URL to web api

    constructor(private http: Http,
                private _cookieService: CookieService) {
    }

    addQuestion(question: Pquestion): Promise<Pquestion> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        // return this.http.post(this.pqsUrl + "/create", JSON.stringify(question), {headers: headers})
        return this.http.post(this.pqsUrl, JSON.stringify(question), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    delQuestion(questionid: number) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.delete(this.pqsUrl + "/" + questionid, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    listQuestions(): Promise<Pquestion[]> {
        let headers = new Headers();
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        return this.http.get(this.pqsUrl, {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    updateQuestion(question: Pquestion): Promise<Pquestion> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-CSRFToken', this._cookieService.get("csrftoken"));
        headers.append('Authorization', "JWT " + sessionStorage.getItem('token'));
        let url = this.pqsUrl + '/' + question.id;
        return this.http.put(url, JSON.stringify(question), {headers: headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}