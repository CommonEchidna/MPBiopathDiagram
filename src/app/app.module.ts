import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {PathwayDiagramComponent} from './pathway-diagram/pathway-diagram.component';
import {RouterModule} from "@angular/router";
import { DashboardComponent } from './dashboard/dashboard.component';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatFormFieldModule} from '@angular/material/form-field'

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PathwayDiagramComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    MatButtonToggleModule,
    MatFormFieldModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
