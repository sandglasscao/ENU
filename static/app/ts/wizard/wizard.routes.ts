import {provideRouter, RouterConfig}  from '@angular/router';

import {WizardComponent} from './wizard.component';
import {AddressComponent} from '../dashboard/address.component';
import {ContactComponent} from '../dashboard/contact.component';
import {ProfileComponent} from '../dashboard/profile.component';
import {TaxpayerComponent} from '../dashboard/taxpayer.component';

export const wizardRoutes: RouterConfig = [

    {
        path: 'wizard',
        component: WizardComponent,
        children: [
            {
                path: 'profile',
                component: ProfileComponent

            },
            {
                path: 'contact',
                component: ContactComponent

            },
            {
                path: 'address',
                component: AddressComponent

            },
            {
                path: 'taxpayer',
                component: TaxpayerComponent

            },
            {
                path: '',
                component: ProfileComponent,
            },
        ]
    },

];

