import { Component, ViewChild, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../../app/services/plan-service';
import { Plan } from '../../app/models/plan';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data-service';


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
  
  constructor(private dataService:DataService, private router: Router, private planService: PlanService, public auth:AuthService ) {

  }
  title = 'finance-app';
  date;
  displayName: string;
  uid:string;
  activePlan: Object;
  showNotifications = true;

  navLinks = [
    {name:'DASHBOARD', icon:'insert_chart', active:true, link:'/'},
    {name:'PLANS', icon:'insert_invitation', active:false, link:'/plans'},
    {name:'PAYMENTS', icon:'money', active:false, link:'/payments'},
    {name:'SETTINGS', icon:'build', active:false, link:'/settings'},
    
    
  ]

  ngOnInit(){

    this.planService.getActivePlan()
      .subscribe(res => {
        this.activePlan = res[0];
        if (!this.activePlan['activePlan']){
          this.showNotifications = false;
        }
      })

    this.auth.user$.subscribe(res => this.displayName = res.displayName);
    this.auth.user$.subscribe(res => this.uid = res.uid);
 
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



