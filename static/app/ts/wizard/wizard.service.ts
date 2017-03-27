import {Injectable}     from '@angular/core';

@Injectable()
export class WizardService {
    defaultUrl = '/dashboard';
    preWizardUrl = '/wizard/';

    nextStep(currUrl: string): string {
        //if it does not come from 'wizard', it routes to its parent page
        let parentUrl = currUrl.split('/')[1];
        let nextstepsStr = sessionStorage.getItem('nextsteps');
        if (parentUrl != 'wizard')
            return '/' + parentUrl;
        if (nextstepsStr.length == 0 && parentUrl == 'wizard')
            return this.defaultUrl;

        //prepare the data for the previous steps
        let prestepsStr = sessionStorage.getItem('presteps');
        let presteps = prestepsStr ? prestepsStr.split(',') : [];
        presteps.push(sessionStorage.getItem('currstep'));

        //calc the current step
        let nextsteps = nextstepsStr.split(',');
        let currStep = nextsteps.splice(0, 1).toString();

        sessionStorage.setItem('presteps', presteps.toString());
        sessionStorage.setItem('currstep', currStep);
        sessionStorage.setItem('nextsteps', nextsteps.toString());

        let path = this.preWizardUrl + currStep;
        return path;
    }

    preStep(): string {
        //save current step into the next steps
        let nextstepsStr = sessionStorage.getItem('nextsteps');
        let nextsteps = [sessionStorage.getItem('currstep')].concat(nextstepsStr.split(','));

        //calc the current step
        let prestepsStr = sessionStorage.getItem('presteps');
        let presteps = prestepsStr.split(',');
        let currStep = presteps.pop().toString();

        sessionStorage.setItem('currstep', currStep);
        sessionStorage.setItem('presteps', presteps.toString());
        sessionStorage.setItem('nextsteps', nextsteps.toString());

        let path = this.preWizardUrl + currStep;
        return path;
    }
}