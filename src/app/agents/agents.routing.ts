import { Routes } from '@angular/router';

import { AgentsManageComponent } from './manage.component';
import { WorkingHoursComponent } from './workingHours.component';
export const AgentsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'manage',
        component: AgentsManageComponent
    }]
}, {
    path: '',
    children: [{
        path: 'workinghours',
        component: WorkingHoursComponent
    }]
}
];
