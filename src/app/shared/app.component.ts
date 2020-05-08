import { Component, ViewChild, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../../app/services/plan-service';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { NavigationEnd } from '@angular/router';
import { ErrorService } from '../services/error.service';

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
  
  constructor(private router: Router, private errorService:ErrorService, private planService: PlanService, public auth:AuthService ) {

  }
  title = 'Owl';
  date;
  displayName: string;
  uid:string;
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
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });

    this.date = moment(new Date()).format('DD/MM/YYYY');
  }


  setActiveOninit(event){

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



