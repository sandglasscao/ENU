import {provideRouter, RouterConfig}  from '@angular/router';

import {AddressComponent} from './address.component';
import {ContactComponent} from './contact.component';
import {DashboardComponent} from './dashboard.component';
import {DeliveryComponent} from './delivery.component';
import {NotificationComponent} from './notification.component';
import {PasswordComponent} from './password.component';
import {ProfileComponent} from './profile.component';
import {TaxpayerComponent} from './taxpayer.component';
import {WelcomeComponent} from './welcome.component';

export const dashboardRoutes: RouterConfig = [

    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'profile',
                component: ProfileComponent

            },
            {
                path: 'password',
                component: PasswordComponent

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
                path: 'delivery',
                component: DeliveryComponent

            },
            {
                path: 'notify',
                component: NotificationComponent

            },
            {
                path: '',
                component: WelcomeComponent,
            },
        ]
    },

];

