import { Routes } from '@angular/router';

import { MyWebsitesComponent } from './my-websites.component';
import { AddWebsiteComponent } from './add-website.component';
export const MyWebsitesRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'list',
        component: MyWebsitesComponent
    },{
        path: '',
        children: [{
            path: 'add',
            component: AddWebsiteComponent
        }]
    }]
}
];
