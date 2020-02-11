import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlansComponent } from './plans/plans.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {path:'', component:DashboardComponent},
  {path:'plans', component:PlansComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
