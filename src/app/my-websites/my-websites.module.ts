import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';

import { MyWebsitesComponent } from './my-websites.component';
import { AddWebsiteComponent } from './add-website.component';
import { MyWebsitesRoutes } from './my-websites.routing';
import { Injectable, Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'greaterthan'
})
@Injectable()
export class GreaterThanPipe implements PipeTransform {
 transform(items: any[], field: string, value: string): any[] {
   if (!items) return [];
   return items.filter(it => it[field] >= value);
 }
}

@Pipe({
    name: 'lessthan'
})

@Injectable()
export class LessThanPipe implements PipeTransform {
 transform(items: any[], field: string, value: string): any[] {
   if (!items) return [];
   return items.filter(it => it[field] <= value);
 }
}


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MyWebsitesRoutes),
        FormsModule,
        MdModule
    ],
    declarations: [MyWebsitesComponent, AddWebsiteComponent, GreaterThanPipe, LessThanPipe]
})

export class MyWebsitesModule {}

