import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path:'control-panel', component:ControlPanelComponent},
  {path:'home', component:HomeComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
