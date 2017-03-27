import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {GrossCheck} from "./gross-check";

@Component({
    selector: 'grss-chk',
    templateUrl: 'static/app/templates/dashboard/gross-check.html',
    directives: [],
    providers: [],

})
export class GrossCheckComponent implements OnInit {
    check_lst = [];
    selectedFile = false;
    grossCheck = new GrossCheck();
    receipt_lst = [];

    count: number;
    count_good: number;
    weightTotal: number;
    volumeTotal: number;

    @Input() show: boolean;
    @Output() changed = new EventEmitter();
    error: any;

    constructor() {
    }

    addItem() {
        let item = {
            'seq_no': this.receipt_lst.length,
            'case_no': '',
            'desc': '',
            'pic': null,
            'advice': ''
        };
        this.receipt_lst.push(item);
    }

    cancel() {
        this.clearGrossCheck();
        this.show = false;
        let result = {'showGross': this.show, 'gross_check': null};
        this.changed.emit(result);
    }

    delItem(item: any) {
        this.receipt_lst = this.receipt_lst.filter(itemn => itemn.seq_no != item.seq_no);
    }

    importItems() {
        this.clearCheckList();
        let grsschk_lst = sessionStorage.getItem('grss_chkitms').split("\r\n");
        let title = grsschk_lst[0].split(",");
        let i = isNaN(title[0]) ? 1 : 0;
        let length = grsschk_lst.length;
        this.count = i ? length - 1 : length;
        while (i < length) {
            let line = grsschk_lst[i].replace(/ /g, "").split(",");
            let grssChkItem = {'seq_no': line[0], 'case_no': line[1], 'volume': line[2], 'weight': line[3]};
            this.check_lst.push(grssChkItem);
            this.volumeTotal += Number(line[2]);
            this.weightTotal += Number(line[3]);
            i++;
        }
        sessionStorage.removeItem('grss_chkitms');
        this.selectedFile = false;
    }

    ngOnInit() {
        this.clearGrossCheck();
    }

    onSubmit() {
        this.grossCheck.check_lst = this.check_lst;
        this.grossCheck.receipt_lst = this.receipt_lst;
        this.show = false;
        let result = {'showGross': this.show, 'gross_check': this.grossCheck};
        this.changed.emit(result);
    }

    selectFile() {
        let fileEl = document.getElementsByName('chkfile').valueOf()[0].files;
        let file = fileEl.item(0);
        let fileExts = ["txt", "csv"];
        if (fileExts.indexOf(file.name.split(".")[1]) >= 0) {
            this.error = null;
            let reader = new FileReader();
            reader.onload = function () {
                sessionStorage.setItem('grss_chkitms', this.result);
            };
            reader.readAsText(file);
            this.selectedFile = true;
        }
        else {
            this.error = "请选择txt或csv文件！"
        }
    }

    selectPic(item: any) {
        let fileUpload = document.getElementsByName('picfile').valueOf()[item.seq_no].files;
        let file = fileUpload.item(0);
        this.receipt_lst.forEach(itemp => {
            if (itemp.seq_no == item.seq_no)
                itemp.pic = file;
        })
    }

    private clearCheckList() {
        this.check_lst = [];
        this.count = 0;
        this.volumeTotal = 0;
        this.weightTotal = 0;
    }

    private clearGrossCheck() {
        this.clearCheckList();
        this.clearReceiptList();
        this.grossCheck.check_lst = this.check_lst;
        this.grossCheck.receipt_lst = this.receipt_lst;
    }


    private clearReceiptList() {
        this.receipt_lst = [];
        this.count_good = 0;
    }
}