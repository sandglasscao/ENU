///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>
import { bootstrap }    from '@angular/platform-browser-dynamic';
// import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import {enableProdMode} from '@angular/core';
import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import {CookieService} from 'angular2-cookie/core';

enableProdMode();
bootstrap(AppComponent,[
//   disableDeprecatedForms(),
//   provideForms(),
  CookieService,
  APP_ROUTER_PROVIDERS,
  HTTP_PROVIDERS
])
.catch(err => console.error(err));
