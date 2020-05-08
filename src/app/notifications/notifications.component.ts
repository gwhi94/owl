import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../services/data-service';
import { PlanService } from '../services/plan-service';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { ErrorService } from '../services/error.service';

declare var $: any;


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  mostSpent:String;
  spentToday:Number;
  spentThisWeek:Number;
  percentageSpent: Number;
  uid:string;
  currency:string;

  constructor(private auth:AuthService, private errorService:ErrorService, private settingsService:SettingsService, private planService:PlanService, private dataService:DataService) { }

  ngOnInit() {


    this.auth.user$.subscribe(res => {
      this.getSettings(res.uid);
      this.uid = res.uid;
      
    });

  } 


  getSettings(uid){
    this.settingsService.getSettings(uid)
      .subscribe(res =>{
        this.currency = res[0]['currency'];
        this.setupNotifications()
      },
      error => {
        this.errorService.showError("Failed to retrieve settings");
      })

  }

  setupNotifications(){
    
    this.dataService.currentMostSpent.subscribe(mostSpent => {
      this.mostSpent = mostSpent;
      
    })
    this.dataService.currentSpentToday.subscribe(spentToday => {     
      this.spentToday = spentToday;
      
    })
    this.dataService.currentSpentThisWeek.subscribe(spentThisWeek => {
      this.spentThisWeek = spentThisWeek;
      
    })
    this.dataService.currentPercentageSpent.subscribe(percentageSpent => {
      this.percentageSpent = percentageSpent;
      
    }) 

    $('.carousel').carousel({
      interval: 4000,
      pause:false
    })

  }

}
