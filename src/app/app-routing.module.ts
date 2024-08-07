import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [{
  path: 'login', component: LoginComponent 
  // // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: '', redirectTo: '/login', pathMatch: 'full' }
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
