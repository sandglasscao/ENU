import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {NicwdcdRegexService} from './nicwdcd-regex.service';
import {NiceWeidcodeRegex} from './nicwdcd-regex';
import {MetadataService} from '../metadata/metadata.service';
import {MetaType} from "../metadata/metatype";

@Component({
    templateUrl: 'static/app/templates/operation/nicwdcd-regex.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        NicwdcdRegexService,
        MetadataService
    ]
})
export class NicWdcdRegexComponent {
    regex = new NiceWeidcodeRegex();

    regexs: NiceWeidcodeRegex[];
    error: any;
    userTypes: MetaType[];

    constructor(private nicwdcdRegexService: NicwdcdRegexService,
                private metadataService: MetadataService,
                private router: Router) {
    }

    ngOnInit() {
        this.nicwdcdRegexService
            .listRegex()
            .then(regexs => this.regexs = regexs)
            .catch(error => this.error = error);

        let code = '1001';
        this.metadataService
            .listMetaType(code)
            .then(usertypes => this.userTypes = usertypes)
            .catch(error => this.error = error);
    }

    addRegex() {
        this.nicwdcdRegexService
            .addRegex(this.regex)
            .then(regex => {
                //console.log('new nice weidcode regex :' + JSON.stringify(regex));
                this.regexs.push(regex);
                this.regex = new NiceWeidcodeRegex();
                //this.applyRegex(regex);
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    delItem(regex: NiceWeidcodeRegex) {
        this.nicwdcdRegexService
            .delRegex(regex.id)
            .then(res => this.regexs = res.ok ? this.regexs.filter(item => item.id != regex.id) : this.regexs)
            .catch(error => this.error = error);
    }
}