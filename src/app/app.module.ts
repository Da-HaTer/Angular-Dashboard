import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { LinechartComponent } from './components/charts/linechart/linechart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { BarchartComponent } from './components/charts/barchart/barchart.component';
import { RadarchartComponent } from './components/charts/radarchart/radarchart.component';
import { DoughnutchartComponent } from './components/charts/doughnutchart/doughnutchart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AreachartComponent } from './components/charts/areachart/areachart.component';
import { RadialchartComponent } from './components/charts/radialchart/radialchart.component';
import { MatTableModule,} from '@angular/material/table';
import { MatTabsModule} from '@angular/material/tabs';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [
    AppComponent,
    LinechartComponent,
    BarchartComponent,
    RadarchartComponent,
    DoughnutchartComponent,
    DashboardComponent,
    AreachartComponent,
    RadialchartComponent,
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    MatTabsModule
],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
