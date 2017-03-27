import {Component, OnInit, Input} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MetadataService} from '../metadata/metadata.service'
import {MetaType} from '../metadata/metatype';
import {Taxpayer} from './taxpayer';
import {TaxpayerService}  from './taxpayer.service';
import {WizardService} from '../wizard/wizard.service';

@Component({
    selector: 'txpr-dtl',
    templateUrl: 'static/app/templates/dashboard/taxpayer.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        MetadataService,
        TaxpayerService,
        WizardService,
    ]
})
export class TaxpayerComponent implements OnInit {
    isOptUrl = false;
    error = null;
    fileData = new FormData();
    hasTaxpayer = false;
    @Input() myTaxpayer = new Taxpayer();
    isSelected = false;
    showPic = false;
    taxpayerTypes: MetaType[];

    lineWidths = [
        {'name': '细', 'value': 5},
        {'name': '粗', 'value': 10},
        {'name': '加粗', 'value': 20}
    ];
    painter = {
        'can': null,
        'ctx': null,
        'width': 600,   //canvas width
        'height': 300,  //canvas height
        'bColor': 'white',   //brush color
        'bWidth': 32,   //brush width
        'lineWidth': this.lineWidths[1].value,  // line width default = 10
        'toPaint': false,
        'img': null
    };

    tips = `以下证明图片文件，任选其一：
1. 增值税专用发票记账联，盖有“一般纳税人”章的税务登记（“三证合一”）
2. 税务局公网公布截屏
3. 其他证明文件
`;
    allowedFiles = ['bmp', "png", "gif", "jpg", "jpeg"];
    alertMsg = '文件格式仅限于' + this.allowedFiles.toString() + '格式，请重新选择';

    constructor(private metadataService: MetadataService,
                private router: Router,
                private taxpayerService: TaxpayerService,
                private wizardService: WizardService) {
    }

    cancel() {
        this.foreward();
    }

    erase() {
        this.startDraw();
    }

    ngOnInit() {
        this.initPainter();
        this.listOptiones();
        this.fromOpt();
        if (this.myTaxpayer.id) {
            this.reloadPainter();
            this.hasTaxpayer = true;
            return;
        }
        this.taxpayerService
            .listTaxpayers()
            .then(res => {
                if (res.count) {
                    this.myTaxpayer = res.results[0];
                    this.reloadPainter();
                    this.hasTaxpayer = true;
                }
                else
                    this.hasTaxpayer = false;
            })
            .catch(error => console.log(error))
    }

    onSubmit() {
        this.setTaxpayer();
        if (this.hasTaxpayer) {
            this.taxpayerService
                .updateTaxpayer(this.myTaxpayer.id, this.fileData)
                .then(taxpayer => {
                    this.myTaxpayer = taxpayer;
                    this.foreward();
                })
                .catch(error => console.log(error));
        }
        else
            this.taxpayerService
                .addTaxpayer(this.fileData)
                .then(taxpayer => {
                    this.myTaxpayer = taxpayer;
                    this.hasTaxpayer = true;
                    this.foreward();
                })
                .catch(error => console.log(error));
    }

    refresh() {
        this.painter.ctx.drawImage(this.painter.img, 0, 0);
    }

    selectedPic() {
        let cxt = this.painter.ctx;
        let fileEl = document.getElementsByName('invoicepic').valueOf()[0].files;
        let file = fileEl.item(0);
        if (file && this.isPicture(file)) {
            let img = this.painter.img;
            let reader = new FileReader();
            reader.onload = function () {
                img.src = this.result;
                cxt.drawImage(img, 0, 0);
            };
            reader.readAsDataURL(file);
            this.isSelected = true;
        }
        else
            this.error = file ? this.alertMsg : this.error;
    }

    setlineWidth() {
        this.painter.ctx.lineWidth = this.painter.lineWidth;
    }

    private fire(painter, eventName, param, toPaint) {
        if (toPaint) {
            switch (eventName) {
                case 'onStartDraw': {
                    painter.ctx.beginPath();
                    painter.ctx.moveTo(param.x, param.y);
                    break;
                }
                case 'onDrawing': {
                    painter.ctx.lineTo(param.x, param.y);
                    painter.ctx.stroke();
                    break;
                }
            }
        }
    }

    private foreward() {
        this.router.navigate([this.wizardService.nextStep(this.router.url)]);
    }

    private initPainter() {
        this.painter.can = document.getElementsByTagName('canvas').item(0);
        this.painter.can.width = this.painter.width;
        this.painter.can.height = this.painter.height;
        this.painter.ctx = this.painter.can.getContext('2d');
        this.painter.ctx.lineWidth = this.painter.lineWidth;
        this.painter.ctx.strokeStyle = this.painter.bColor;
        this.painter.img = new Image();
        //this.startDraw();
    }

    private fromOpt() {
        let url = this.router.url;
        url = url.split('/')[1];
        if (url == 'opt')
            this.isOptUrl = true;
    }

    private isPicture(file: File): boolean {
        let ext = file.name.split('.')[1].toLowerCase();
        return this.allowedFiles.indexOf(ext) < 0 ? false : true;
    }

    private listOptiones() {
        let type = '1006';
        this.metadataService
            .listMetaType(type)
            .then(taxpayertypes => this.taxpayerTypes = taxpayertypes)
            .catch(error => console.log(error));
    }

    private reloadPainter() { //reset canvas with the uploaded invoice picture
        if (this.myTaxpayer.invoicepic) {
            this.painter.img.src = this.myTaxpayer.invoicepic;
            this.painter.ctx.drawImage(this.painter.img, 0, 0);
            this.showPic = true;
        }
    }

    private startDraw() {
        let painter = this.painter;
        let fire = this.fire;
        painter.can.onmousedown = function (e) {
            e.preventDefault();
            let x = e.offsetX;
            let y = e.offsetY;
            painter.toPaint = true;
            fire(painter, 'onStartDraw', {'x': x, 'y': y}, painter.toPaint);
        };
        painter.can.onmousemove = function (e) {
            let x = e.offsetX;
            let y = e.offsetY;
            fire(painter, 'onDrawing', {'x': x, 'y': y}, painter.toPaint);
        };
        painter.can.onmouseup = function (e) {
            painter.toPaint = false;
        };
    }

    private setTaxpayer() {
        if (this.myTaxpayer.category == '1')
            this.setUploadFile();
        else {
            this.myTaxpayer.taxpayerno = null;
            this.myTaxpayer.phaddr = null;
            this.myTaxpayer.bankacct = null;
        }
        this.fileData.append('taxpayer', JSON.stringify(this.myTaxpayer));
    }

    private setUploadFile() {
        if (this.isSelected) {
            let bs64str = this.painter.can.toDataURL('image/png');
            bs64str = bs64str.substring(22);
            let fileEl = document.getElementsByName('invoicepic').valueOf()[0].files;
            let file = new File([bs64str], fileEl.item(0).name.split('.')[0] + '.png');
            this.fileData.append('invoicepic', file);
        }
    }
}

