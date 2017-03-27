import {Injectable}    from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {AddressCode} from './addresscode'
import {MetaType} from './metatype';
import {SecurityQuestion} from './security-question';

@Injectable()
export class MetadataService {
    private baseUrl = 'api/metadata';

    constructor(private http: Http) {
    }

    getBlocks(district) {
        return this.http.get(this.baseUrl + "/addresscode/" + district)
            .toPromise()
            .then(response => response.json() as AddressCode[])
            .catch(this.handleError);
    }

    getCities(province) {
        return this.http.get(this.baseUrl + "/addresscode/" + province)
            .toPromise()
            .then(response => response.json() as AddressCode[])
            .catch(this.handleError);
    }

    getCountries() {
        return this.http.get(this.baseUrl + "/addresscode/00")
            .toPromise()
            .then(response => response.json() as AddressCode[])
            .catch(this.handleError);
    }

    getDistricts(city) {
        return this.http.get(this.baseUrl + "/addresscode/" + city)
            .toPromise()
            .then(response => response.json() as AddressCode[])
            .catch(this.handleError);
    }

    getProvinces(country) {
        return this.http.get(this.baseUrl + "/addresscode/" + country)
            .toPromise()
            .then(response => response.json() as AddressCode[])
            .catch(this.handleError);
    }

    listMetaType(codestr: string): Promise<MetaType[]> {
        let url = this.baseUrl + '/metatype/' + codestr;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    listSecurityQuestion(): Promise<SecurityQuestion[]> {
        let url = this.baseUrl + '/scrtq';
        return this.http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error(error);
        return Promise.reject(error._body);
    }
}