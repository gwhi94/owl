import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlansComponent } from '../plans/plans.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PaymentsComponent } from '../payments/payments.component';
import { AuthGuard } from '../services/auth.guard';
import { SettingsComponent } from '../settings/settings.component';


const routes: Routes = [
  {path:'', component:DashboardComponent, canActivate: [AuthGuard]},
  {path:'plans', component:PlansComponent, canActivate: [AuthGuard]},
  {path:'payments', component:PaymentsComponent, canActivate: [AuthGuard]},
  {path:'settings', component:SettingsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
