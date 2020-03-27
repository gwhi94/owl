import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../services/data-service';
import { PlanService } from '../services/plan-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  //Things in notifications
    //Upcoming payments query firestore maybe
    //Spent today daily left minus var daily left
    //Spent this week same as above
    //Currently spent the most on  get from dashboard component

  mostSpent:String;
  spentToday:Number;
  spentThisWeek:Number;

  constructor(private planService:PlanService, private dataService:DataService) { }

  ngOnInit() {
    this.dataService.currentMostSpent.subscribe(mostSpent => this.mostSpent = mostSpent)
    this.dataService.currentSpentToday.subscribe(spentToday => this.spentToday = spentToday)
    this.dataService.currentSpentThisWeek.subscribe(spentThisWeek => this.spentThisWeek = spentThisWeek)

    

  }

}
