import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { WorkingHoursComponent } from './workingHours.component';
import { AgentsManageComponent } from './manage.component';
import { AgentsRoutes } from './agents.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AgentsRoutes),
        FormsModule,
        MdModule
    ],
    declarations: [AgentsManageComponent, WorkingHoursComponent]
})

export class AgentsModule {}
