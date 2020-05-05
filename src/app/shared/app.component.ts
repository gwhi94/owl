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
import { NavigationEnd } from '@angular/router';

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
  displayName: string;
  uid:string;
  activePlan: Object;
  showNotifications = true;
  today = moment();
  todayFormatted = this.today.format("DD-MM-YYYY");
  navLink:Object;

  navLinks = [
    {name:'DASHBOARD', icon:'insert_chart', active:true, link:'/'},
    {name:'PLANS', icon:'insert_invitation', active:false, link:'/plans'},
    {name:'PAYMENTS', icon:'money', active:false, link:'/payments'},
    {name:'SETTINGS', icon:'build', active:false, link:'/settings'},
    
    
  ]

  ngOnInit(){


    this.router.events.subscribe((event) => { event instanceof NavigationEnd ? this.setActiveOninit(event): null })

    this.auth.user$.subscribe(res => this.displayName = res.displayName);
    this.auth.user$.subscribe(res => {this.uid = res.uid;this.getActivePlan(res.uid)});
 
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });

    this.date = moment(new Date()).format('DD/MM/YYYY');
 
    //this is where we need to get the active plan
    //so db query logic fired from here. 
  }

  getActivePlan(uid){
    this.planService.getActivePlan(uid)
    .subscribe(res => {
      this.activePlan = res[0];
      if (!this.activePlan['activePlan']){
        this.showNotifications = false;
      }
    })
  }

  setActiveOninit(event){
    console.log(event.url);

    for(let i = 0 ; i < this.navLinks.length; i++){
      if(this.navLinks[i]['link'] == event.url){
        this.activateClass(this.navLinks[i]);
      }
    }
  }

  activateClass(navLink){
    console.log(navLink);
    this.navLinks.forEach(function(link){
      link.active = false;
    });
    navLink.active = !navLink.active;
  }
    
}



