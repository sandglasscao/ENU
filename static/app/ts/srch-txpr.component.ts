import {Component} from '@angular/core';

import {SrchTxprService}  from './srch-txpr.service';
import {Taxpayer}  from './dashboard/taxpayer';
import {TaxpayerComponent} from './dashboard/taxpayer.component';


@Component({
    selector: 'srch-taxpayer',
    templateUrl: 'static/app/templates/srch-txpr.html',
    directives: [TaxpayerComponent],
    providers: [
        SrchTxprService,
    ]
})
export class SrchTxprComponent {
    isSelected = false;
    matching = '';
    example = `查询示例`;
    // isDetail = false;
    // taxpayer: Taxpayer;

    count: number;
    pageNo: number;
    taxpayers: Taxpayer[];
    nextpg: string;
    previouspg: string;

    constructor(private srchTxprService: SrchTxprService) {
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

    // showDetail(taxpayer: Taxpayer) {
    //     this.isDetail = true;
    //     this.taxpayer = taxpayer;
    // }

    private clearScr() {
        this.count = null;
        this.matching = '';
        this.nextpg = null;
        this.taxpayers = null;
        this.pageNo = null;
        this.previouspg = null;
    }
}