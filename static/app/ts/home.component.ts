import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {SrchTxprComponent} from './srch-txpr.component';

@Component({
  selector: 'home',
  templateUrl: 'static/app/templates/home.html',
  directives: [ROUTER_DIRECTIVES, SrchTxprComponent]

})
export class HomeComponent { }