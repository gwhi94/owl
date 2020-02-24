import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan-service';
import { AddCostModalComponent } from '../modals/add-cost-modal/add-cost-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  activePlan:Object;
  planProgressPercentage:number;
  planProgessColor:string;
  currentDate:string; 
  lockPlan = false;

  today = moment(moment());  ;

  constructor(private planService:PlanService, public dialog: MatDialog ) { }

  ngOnInit() {
    let today = moment(moment());    
  
    this.planService.getActivePlan()
      .subscribe(result => {     
        
        if(result[0].excludeWeekends){
          if(moment().day() == 0 || moment().day() == 6){
            this.lockPlan = true;
          }else {
            this.lockPlan = false;
          }        
        }
        


        if(!moment(result[0].lastUpdated).isSame(this.today, 'd')){

          result[0].variableDailyLeft = result[0].dailyLeft; 
          //this will definitely need testing 
                         
          this.updatePlanData(result[0]);
        
        }else {
          console.log("Plan has been updated today");
          result[0].lastUpdated = this.today.format('YYYY-MM-DDYYYY-MM-DDTHH:mm:ss.SSS');
          //user is logging in on a daily basis, do week passed check

          if(result[0].excludeWeekends){
            //week is 5 days 
            if(moment(result[0].weekUpdated).diff(this.today, 'days') == 5){
              console.log("Exlcuding Weekends and 5 days has passed so reset weekly left");
              //and set week updated to today
            }else{
              console.log("False");
            }
          }else{
            //week is 7 days
            if(moment(result[0].weekUpdated).diff(this.today, 'days') == 7){
              console.log("Including Weekends and excatly 7 days has passed so reset weekly left");
              //and set week updated to today
            }else{
              console.log("False");
            }
  
          }
          this.planService.updatePlan(result[0].id, result[0])
            .then(
               res => {
                console.log("Plan updated");
                this.activePlan = result[0];  
              } 
          )  
        }

      });
      //need to put this in if below certain percentage turn red.
      this.planProgessColor = 'green';
      this.planProgressPercentage = 50;
  }

  updatePlanData(plan){
   
    //only update days left and surplus if plan is more than a day old

     
      //updating days left      
      let planEnd = moment(plan['dateRange']['end']);
      planEnd.diff(this.today, 'days');
      plan.days = planEnd.diff(this.today, 'days');

      //calculating any surplus
      //need to do a check here to only do this if last updated is not today
      //otherwise we get multiplication by zero and it resets the surplus.
      let lastUpdated = moment(plan['lastUpdated']);
      let afkPeriod  = this.today.diff(lastUpdated, 'days');           
      var dayInTheWeek = moment().day();


      //FOR TESTING REMOVE AFTER
      dayInTheWeek = 1
      //FOR TESTING REMOVE AFTER

        

      if(afkPeriod > 1){
        if(plan.excludeWeekends){
          //week is 5 days
         if(afkPeriod > 5){
            console.log("Afk period is greater than 5");


            let weekDays = this.getWorkDays(moment(plan.lastUpdated), this.today);
            console.log(weekDays);


            let weekAmountToSet = ((5 - dayInTheWeek) * (plan.dailyleft)) + 1;
            plan.variableWeeklyLeft = weekAmountToSet;
            plan.surplus = plan.surplus + (weekDays * plan['dailyleft']); 
          
            //Needs testing !!!!
           
           
           
            // console.log(weekAmountToSet);
          }        
        }else{
          //week is 7 days
         if (afkPeriod > 7){
            console.log("User hasnt looged in for more than 7 days, so setting var weekly");
            let weekAmountToSet = ((7 - dayInTheWeek) * (plan.dailyleft)) + 1;
            plan.variableWeeklyLeft = weekAmountToSet;
            plan.surplus = plan.surplus + (afkPeriod * plan['dailyleft']); 
            plan.variableDailyLeft = plan.dailyleft;
            console.log(weekAmountToSet);
          }

        }

      }
       
      plan.lastUpdated = this.today.format('YYYY-MM-DDYYYY-MM-DDTHH:mm:ss.SSS');
      
      //updating plan before setting as active plan
      this.planService.updatePlan(plan.id, plan)
        .then(
          res => {
            console.log("Plan updated");
            this.activePlan = plan;  
          }
        )       

  }


  getWorkDays(start, end){
   
    console.log(start, end);

    var first = start.clone().endOf('week'); // end of first week
    var last = end.clone().startOf('week'); // start of last week
    var days = last.diff(first,'days') * 5 / 7; // this will always multiply of 7
    var wfirst = first.day() - start.day(); // check first week
    if(start.day() == 0) --wfirst; // -1 if start with sunday 
    var wlast = end.day() - last.day(); // check last week
    if(end.day() == 6) --wlast; // -1 if end with saturday
  
    return (Math.round((wfirst + days + wlast))) -1; // get the total


  }

  addCost(){
    let dialogRef = this.dialog.open(AddCostModalComponent, {     
    })
    dialogRef.afterClosed().subscribe(result => {
      this.recalculatePlan(result);

    })

  }

  recalculatePlan(cost) {
    console.log(cost);
    this.activePlan['currentSpent'] = (this.activePlan['currentSpent'] + cost.cost);
    this.activePlan['currentLeft'] = (this.activePlan['currentLeft'] - this.activePlan['currentSpent']); 
    
    console.log(this.activePlan);

    this.activePlan['variableDailyLeft'] = (this.activePlan['variableDailyLeft'] - cost.cost);



    //need to be recalculating total left and left this week
    //total left is a running count so am free to manipulate that 
    //left this week is a tick amount like daily left so will need a variable weekly left as well.
    //need to to an update on all of these at the end !!!!
    
    //when daily left hits zero, no more payments can be added(yet)
    //this means that the original daily left never needs to be recalculated.

    





  }

  

}
