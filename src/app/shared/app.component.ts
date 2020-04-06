import { Component, ViewChild, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../../app/services/plan-service';
import { Plan } from '../../app/models/plan';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  screenWidth:number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  
  @ViewChild ('sidenav', {static: false}) sidenav: MatSidenav;
  
  constructor(private router: Router, private planService: PlanService, public auth:AuthService ) {

  }
  title = 'finance-app';
  date;

  navLinks = [
    {name:'DASHBOARD', icon:'insert_chart', active:true, link:'/'},
    {name:'PLANS', icon:'insert_invitation', active:false, link:'/plans'},
    {name:'PAYMENTS', icon:'money', active:false, link:'/payments'},
    {name:'SETTINGS', icon:'build', active:false},
    
    
  ]

  ngOnInit(){

    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });

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



