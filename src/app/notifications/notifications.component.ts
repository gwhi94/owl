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

    setTimeout(() =>{
      this.rollNotificationsPanel()
    }, 2000);
  
  }

  public rollNotificationsPanel(){
    var i = 1;
    var interval = setInterval(increment, 4000);
    var headertext = '';
    var that = this;
    //preserving this for use inside function
    
    function increment(){
        i = i + 1;
        if(i>4) {i = 1;}
  
          if(i==1){headertext = "You have currently spent the most on "+ that.mostSpent + " during the duration of this plan."}
          if(i==2){headertext = "You have spent "+that.percentageSpent+"% of your current plan so far."}
          if(i==3){headertext = "Today you have spent £"+that.spentToday}
          if(i==4){headertext = "This week you have spent £"+that.spentThisWeek}

          $('.notification').animate({'opacity': 0}, 1000, function () {
              $('.notification').text(headertext);
          }).animate({'opacity': 1}, 1000);
       
        }   

  }

}
