import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {AddressCodeService} from './address-code.service';

@Component({
    templateUrl: 'static/app/templates/operation/address-code.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        AddressCodeService
    ]
})
export class AddressCodeComponent {
    selectedFile = false;

    addrUrl: string;
    error: any;
    file: File;
    pendingUrls: string[]

    constructor(private addrCodeService: AddressCodeService) {
    }

    ngOnInit() {
    }

    refresh() {
        this.addrCodeService
            .refresh(this.addrUrl)
            .then(res => {
                var a = 1;
                a = a + 1;
                this.pendingUrls = res;
            })
            .catch(error => this.error = error)
    }

    save() {
        this.addrCodeService
            .uploadFile(this.file)
            .catch(error => this.error = error);
    }

    selectFile() {
        let fileEl = document.getElementsByName('addrfile').valueOf()[0].files;
        let file = fileEl.item(0);
        let fileExts = ["txt", "csv"];
        if (fileExts.indexOf(file.name.split(".")[1]) >= 0) {
            this.file = file;
            this.selectedFile = true;
        }
        else {
            this.error = "请选择txt或csv文件！";
            this.selectedFile = false;
        }
    }
}