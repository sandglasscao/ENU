import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {CertifyTxprService} from './certify-taxpayer.service';
import {Taxpayer} from '../dashboard/taxpayer';
import {TaxpayerComponent} from '../dashboard/taxpayer.component';
import {SrchTxprService} from '../srch-txpr.service';

@Component({
    selector: 'cert-txpr',
    templateUrl: 'static/app/templates/operation/certify-txpr.html',
    directives: [ROUTER_DIRECTIVES, TaxpayerComponent],
    providers: [
        CertifyTxprService,
        SrchTxprService,
    ]
})
export class CertifyTxprComponent {
    isSelected = false;
    matching = '';
    example = `查询示例`;
    showTaxpayer = false;
    taxpayer: Taxpayer;

    count: number;
    pageNo: number;
    taxpayers: Taxpayer[];
    nextpg: string;
    previouspg: string;

    constructor(private certifyTxprService: CertifyTxprService,
                private router: Router,
                private srchTxprService: SrchTxprService) {
    }

    cancel() {
        this.router.navigate(['/opt']);
    }

    certify(taxpayer: Taxpayer) {
        let fileData = new FormData();
        let currTxpyr = taxpayer;
        currTxpyr.certified = true;
        fileData.append('taxpayer', JSON.stringify(currTxpyr));
        this.certifyTxprService
            .updateTaxpayer(taxpayer.id, {certified: true})
            .then(res => {
                for (var i in this.taxpayers) {
                    this.taxpayers[i].certified = (this.taxpayers[i].id == res.id) ? res.certified : this.taxpayers[i].certified;
                }
            })
            .catch(error => console.log(error));
    }

    ngOnInit() {
    }

    paginate(link: string) {
        this.srchTxprService
            .paginate(link)
            .then(res => {
                this.taxpayers = res.results;
                this.previouspg = res.previous;
                this.nextpg = res.next;
                this.pageNo = Number(res.next ? Number(res.next.split("page=")[1]) - 1 :
                    (res.previous ? Number(res.previous.split("page=")[1]) + 1 : 1));
            })
            .catch(error => console.log(error));
    }

    search(keyword: string) {
        this.srchTxprService
            .search(keyword)
            .then(res => {
                this.pageNo = res.count ? 1 : null;
                this.taxpayers = res.count ? res.results : null;
                this.previouspg = res.previous;
                this.nextpg = res.next;
                this.count = res.count ? Math.ceil(res.count / this.taxpayers.length) : null;
            })
            .catch(error => console.log(error));
    }

    showDetail(taxpayer: Taxpayer) {
        this.showTaxpayer = true;
        this.taxpayer = taxpayer;
    }

    private clearScr() {
        this.count = null;
        this.matching = '';
        this.nextpg = null;
        this.taxpayers = null;
        this.pageNo = null;
        this.previouspg = null;
    }
}