import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {DeliveryService} from './delivery.service';
import {Freight} from './freight';
import {GrossCheckComponent} from './gross-check.component';
import {MetaType} from "../metadata/metatype";
import {MetadataService} from '../metadata/metadata.service';
import {ProfileService} from './profile.service';
import {User} from '../user';


@Component({
    templateUrl: 'static/app/templates/dashboard/delivery.html',
    directives: [ROUTER_DIRECTIVES, GrossCheckComponent],
    providers: [
        DeliveryService,
        ProfileService,
        MetadataService,
    ]

})
export class DeliveryComponent implements OnInit {
    fileData = new FormData();
    freight = new Freight();
    showDetail = false;
    showGross = false;

    error: any;
    methods: MetaType[];
    paymodes: MetaType[];
    shippers: User[];

    constructor(private deliveryService: DeliveryService,
                private metadataService: MetadataService,
                private profileService: ProfileService,
                private router: Router) {
    }

    cancel() {
        this.router.navigate(['/dashboard']);
    }

    changedGrossCheck(value) {
        this.showGross = value['showGross'];
        this.freight.gross_check = value['gross_check'];
        if (this.freight.gross_check) {
            this.freight.count = this.freight.gross_check.check_lst.length ? this.freight.gross_check.check_lst.length : null;
            this.freight.volume = null;
            this.freight.weight = null;
            for (var item in this.freight.gross_check.check_lst) {
                this.freight.volume += Number(this.freight.gross_check.check_lst[item].volume);
                this.freight.weight += Number(this.freight.gross_check.check_lst[item].weight);
            }
        }
        else {
            this.freight.count = null;
            this.freight.volume = null;
            this.freight.weight = null;
        }
    }

    changedDetailCheck(value) {
        this.showDetail = value['showDetail'];
        this.freight.detail_check = value['detail_check'];
    }

    goDetailCheck() {
        this.showDetail = true;
    }

    goGrossCheck() {
        this.showGross = true;
    }

    ngOnInit() {
        this.listOptiones();
        this.listShippers();
        this.search(sessionStorage.getItem('weidcode'), true);
    }

    onSelect(metatype: MetaType) {
        switch (metatype.type) {
            case '1008':
                this.freight.paymode = metatype.code;
                break;
            case '1010':
                this.freight.delivery_method = metatype.code;
                break;
        }

    }

    onSubmit() {
        this.resetFreight();
        this.deliveryService
            .save(this.fileData)
            .catch(error => this.error = error);
        this.router.navigate(['/dashboard']);
    }

    search(weicode: string, from: boolean) {
        this.profileService
            .retrieveProfile(weicode)
            .then(profile => {
                if (from) {
                    this.freight.sender_weidcode = weicode;
                    this.freight.sender_cell = profile.cell;
                    this.freight.sender_address = profile.address.no.toString();
                }
                else {
                    this.freight.recipient_weidcode = weicode;
                    this.freight.recipient_cell = profile.cell;
                    this.freight.recipient_address = profile.address.no.toString();
                }
            })
            .catch(error => this.error = error);
    }

    private resetFreight() {
        this.freight.shipper_weidcode = (this.freight.delivery_method == '2') ? this.freight.shipper_weidcode : null;
        this.fileData.append('freight', JSON.stringify(this.freight));

        this.resetGrossCheck();
        this.resetDetailCheck();
    }

    private resetDetailCheck() {
        let reciept_lst = this.freight.detail_check ? this.freight.detail_check.receipt_lst : null;
        let fileKey = 'detail_check_';
        for (var item in reciept_lst)
            if (reciept_lst[item].pic)
                this.fileData.append(fileKey + reciept_lst[item].seq_no, reciept_lst[item].pic);
    }


    private resetGrossCheck() {
        let reciept_lst = this.freight.gross_check ? this.freight.gross_check.receipt_lst : null;
        let fileKey = 'gross_check_';
        for (var item in reciept_lst)
            if (reciept_lst[item].pic)
                this.fileData.append(fileKey + reciept_lst[item].seq_no, reciept_lst[item].pic);
    }

    private listOptiones() {
        let code = '1008,1010';
        this.metadataService
            .listMetaType(code)
            .then(metaTypes => {
                this.paymodes = metaTypes.filter(metatype => metatype.type == '1008');
                this.methods = metaTypes.filter(metatype => metatype.type == '1010')
            })
            .catch(error => this.error = error);
    }

    private listShippers() {
        this.deliveryService
            .listShippers()
            .then(shippers => this.shippers = shippers)
            .catch(error => this.error = error);
    }

}