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

  //Things in notifications
    //Upcoming payments query firestore maybe
    //Spent today daily left minus var daily left
    //Spent this week same as above
    //Currently spent the most on  get from dashboard component

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
    console.log("ROLL");
    var mostSpent = this.mostSpent;
    var spentThisWeek = this.spentThisWeek;
    var spentToday = this.spentToday;
    var percentageSpent = this.percentageSpent;

    console.log(spentThisWeek);
   
    var i = 1;
    var interval = setInterval(increment, 4000);
    var headertext = '';
    
    function increment(){
        i = i + 1;
        if(i>4) {i = 1;}

        

        console.log("INCREMENT", i);
        console.log(spentThisWeek);
        
          if(i==1){headertext = "You have currently spent the most on "+ mostSpent + " during the duration of this plan."}
          if(i==2){headertext = "You have spent "+percentageSpent+"% of your current plan so far."}
          if(i==3){headertext = "Today you have spent £"+spentToday}
          if(i==4){headertext = "This week you have spent £"+spentThisWeek}


      /*     if(i==1){headertext = "I am a"}
          if(i==2){headertext = "Web Designer"}
          if(i==3){headertext = "Front End Dev"}
          if(i==4){headertext = "Interactivity Specalist"}
          if(i==5){headertext = "Lover of Pixels"}
          if(i==6){headertext = "Bit of a geek"}
          if(i==7){headertext = "Fan of Adorable Animals"} */


          $('.notification').animate({'opacity': 0}, 1000, function () {
              $('.notification').text(headertext);
          }).animate({'opacity': 1}, 1000);

        

        }   


  }

}
