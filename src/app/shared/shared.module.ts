import { NgModule } from '@angular/core';
import { LoginComponent } from "./../components/login/login.component";
import { HeaderComponent } from '../components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [HeaderComponent],
  imports: [LoginComponent, MatToolbarModule,MatIconModule,MatButtonModule,BrowserModule],
  exports: [LoginComponent, HeaderComponent]
})
export class SharedModule { }