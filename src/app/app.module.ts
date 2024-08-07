import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { LinechartComponent } from './components/linechart/linechart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { BarchartComponent } from './components/barchart/barchart.component';
import { RadarchartComponent } from './components/radarchart/radarchart.component';
import { DoughnutchartComponent } from './components/doughnutchart/doughnutchart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    LinechartComponent,
    BarchartComponent,
    RadarchartComponent,
    DoughnutchartComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatExpansionModule
],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
