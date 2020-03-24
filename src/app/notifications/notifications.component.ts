import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../services/data-service';

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

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.currentMostSpent.subscribe(mostSpent => this.mostSpent = mostSpent)

    

    
  }

}
