import { provideRouter, RouterConfig}  from '@angular/router';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { ResetPWDComponent } from './resetpwd.component'
import { dashboardRoutes }  from './dashboard/dashboard.routes';
import { wizardRoutes }  from './wizard/wizard.routes';
import { operationRoutes }  from './operation/operation.routes';
import { OptLoginComponent }  from './operation/opt-login.component';
import { HomeComponent }  from './home.component';


const routes: RouterConfig = [
  {
    path: 'opt-login',
    component: OptLoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'resetpwd',
    component: ResetPWDComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  ...wizardRoutes,
  ...dashboardRoutes,
  ...operationRoutes,
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
