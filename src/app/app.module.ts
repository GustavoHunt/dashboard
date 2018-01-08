import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AppComponent }   from './app.component';
import {JsonpModule} from '@angular/http';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { AuthGuard } from './auth-guard.service';
import 'rxjs/add/operator/map';

import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        SidebarModule,
        NavbarModule,
        JsonpModule,
        FooterModule,
        LocalStorageModule.withConfig({
            prefix: 'msite',
            storageType: 'localStorage'
        })
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    providers: [AuthGuard],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
