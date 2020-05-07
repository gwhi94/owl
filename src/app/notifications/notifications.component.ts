import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../services/data-service';
import { PlanService } from '../services/plan-service';

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

  constructor(private planService:PlanService, private dataService:DataService) { }

  ngOnInit() {
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

    

  } 

}
