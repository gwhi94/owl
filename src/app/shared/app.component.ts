import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../../app/services/plan-service';
import { Plan } from '../../app/models/plan';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private router: Router, private planService: PlanService ) {

  }
  title = 'finance-app';
  date;

  navLinks = [
    {name:'DASHBOARD', icon:'insert_chart', active:false, link:'/'},
    {name:'PLANS', icon:'insert_invitation', active:false, link:'/plans'},
    {name:'PAYMENTS', icon:'money', active:false, link:'/payments'},
    {name:'SETTINGS', icon:'build', active:false},
    {name:'LOG OUT', icon:'account_box', active:false},
    
  ]

  ngOnInit(){

    this.date = moment(new Date()).format('DD/MM/YYYY');
    //this is where we need to get the active plan
    //so db query logic fired from here. 
  }

  activateClass(navLink){
    this.navLinks.forEach(function(link){
      link.active = false;
    });
    navLink.active = !navLink.active;
  }
  
  
}



