import {RouterConfig}  from '@angular/router';

import {AddressCodeComponent} from './address-code.component';
import {CertifyTxprComponent} from './certify-taxpayer.component';
import {NicWdcdRegexComponent} from './nicwdcd-regex.component';
import {OperationComponent} from './operation.component';
import {OptWelcomeComponent} from './opt-welcome.component';
import {SegmentComponent} from './segment.component';

export const operationRoutes: RouterConfig = [
    {
        path: '',
        redirectTo: '/opt',
        pathMatch: 'full'
    },
    {
        path: 'opt',
        component: OperationComponent,
        children: [
            {
                path: 'addrcode',
                component: AddressCodeComponent
            },
            {
                path: 'segment',
                component: SegmentComponent
            },
            {
                path: 'nicwdcd',
                component: NicWdcdRegexComponent
            },
            {
                path: 'certxpr',
                component: CertifyTxprComponent
            },
            {
                path: '',
                component: OptWelcomeComponent
            },
        ]
    },
];

