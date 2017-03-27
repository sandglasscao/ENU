import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NiceWeidcodeService}  from './nice-weidcode.service';
import {NiceWeidcode}  from './nice-weidcode';


@Component({
    selector: 'nic-wdcd',
    templateUrl: 'static/app/templates/nice-weidcode.html',
    directives: [],
    providers: [
        NiceWeidcodeService,
    ]
})
export class NiceWeidcodeComponent {
    isSelected = false;
    matching = '';

    count: number;
    pageNo: number;
    niceWeidcodes: NiceWeidcode[];
    nextpg: string;
    previouspg: string;
    selectedWeidcode: NiceWeidcode;

    @Input() show: boolean;
    @Output() changed = new EventEmitter();
    error: any;

    constructor(private niceWeidcodeService: NiceWeidcodeService) {
    }

    cancel() {
        this.show = false;
        let result = {'show': this.show, 'weidcode': null};
        this.changed.emit(result);
        this.clearScr();
    }

    ngOnInit() {
    }

    onSelect(niceWeidcode: NiceWeidcode) {
        if (niceWeidcode.used) return;
        this.selectedWeidcode = niceWeidcode;
        this.isSelected = true;
    }

    onSubmit() {
        this.show = false;
        let result = {'show': this.show, 'weidcode': this.selectedWeidcode.weidcode};
        this.changed.emit(result);
    }

    paginate(link: string) {
        this.niceWeidcodeService
            .paginate(link)
            .then(res => {
                this.niceWeidcodes = res.results;
                this.previouspg = res.previous;
                this.nextpg = res.next;
                this.pageNo = Number(res.next ? Number(res.next.split("page=")[1]) - 1 :
                    (res.previous ? Number(res.previous.split("page=")[1]) + 1 : 1));
                this.initListBox();
            })
            .catch(error => this.error = error);
    }

    search(matching: string) {
        this.niceWeidcodeService
            .search(matching)
            .then(res => {
                this.pageNo = res.count ? 1 : null;
                this.niceWeidcodes = res.count ? res.results : null;
                this.previouspg = res.previous;
                this.nextpg = res.next;
                this.count = res.count ? Math.ceil(res.count / this.niceWeidcodes.length) : null;
                this.initListBox();
            })
            .catch(error => this.error = error);
    }

    private clearScr() {
        this.count = null;
        this.isSelected = false;
        this.matching = '';
        this.nextpg = null;
        this.niceWeidcodes = null;
        this.pageNo = null;
        this.previouspg = null;
        this.selectedWeidcode = null;
    }

    private initListBox() {
        if (this.niceWeidcodes) {
            this.selectedWeidcode = this.niceWeidcodes[0];
            this.isSelected = true;
        }
        else {
            this.selectedWeidcode = null;
            this.isSelected = false;
        }
    }
}