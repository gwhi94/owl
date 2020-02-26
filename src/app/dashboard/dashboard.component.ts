import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan-service';
import { AddCostModalComponent } from '../modals/add-cost-modal/add-cost-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  activePlan:Object;
  pulledPlan:Object;
  planProgressPercentage:number;
  planProgessColor:string;
  currentDate:string; 
  lockPlan = false;

  today = moment(moment());  

  constructor(private planService:PlanService, public dialog: MatDialog ) { }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log("destroyed");
  }

  ngOnInit() {
     
    this.subscription = this.planService.getActivePlan()
      .subscribe(result => {   
        this.activePlan = result[0];
        this.inspectPlan(this.activePlan);
        this.subscription.unsubscribe();           
      });
 
      //need to put this in if below certain percentage turn red.
      this.planProgessColor = 'green';
      this.planProgressPercentage = 50;
  }


    inspectPlan(plan){
      console.log("inspect plan called");
      
      if(plan.excludeWeekends){
        if(moment().day() == 0 || moment().day() == 6){
          this.lockPlan = true;
        }else {
          this.lockPlan = false;
        }        
      }

      plan.variableDailyLeft == 0 ? this.lockPlan = true: this.lockPlan = false;




      
      let testForSameLastUpdated  = moment(moment(plan.lastUpdated).format('YYYY-MM-DD'));
      let testForSameToday = moment(moment().format('YYYY-MM-DD'));

      if(!moment(testForSameLastUpdated).isSame(testForSameToday)){
        console.log("Not updated today");
        plan.variableDailyLeft = plan['dailyleft'];                     
        this.updateAfkPlan(plan);
      
      }else{
        console.log("Plan has been updated today");                  
        if(plan.excludeWeekends){
          if(moment(plan.weekUpdated).diff(this.today, 'days') == 5){
            console.log("Exlcuding Weekends and 5 days has passed so reset weekly left");
            plan.variableWeeklyLeft = plan.weeklyLeft;
            plan.weekUpdated = this.today.format('YYYY-MM-DD'); 
          }else{
            console.log("Week hasnt passed yet");
          }
        }else{
          //week is 7 days
          if(moment(plan.weekUpdated).diff(this.today, 'days') == 7){
            console.log("Including Weekends and exactly 7 days has passed so reset weekly left");
            plan.variableWeeklyLeft = plan.weeklyLeft;
            plan.weekUpdated = this.today.format('YYYY-MM-DD'); 
          }else{
            console.log("Week hasnt passed yet");
          }
        }
        
        plan.lastUpdated = this.today.format('YYYY-MM-DDTHH:mm:ss.SSS'); 
         this.planService.updatePlan(plan['id'], plan)
            .then( res => {
          this.activePlan = plan;
          }
        )  
      }
      
    }

  
    updateAfkPlan(plan){
    console.log("hit");
    
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
            let weekAmountToSet = ((5 - dayInTheWeek) * (plan.dailyleft)) + 1;
            plan.variableWeeklyLeft = weekAmountToSet;
            plan.surplus = plan.surplus + (weekDays * plan['dailyleft']);         
            //Needs testing !!!!
           
           
          }        
        }else{
          //week is 7 days
         if (afkPeriod > 7){
            console.log("User hasnt looged in for more than 7 days, so setting var weekly");
            let weekAmountToSet = ((7 - dayInTheWeek) * (plan.dailyleft)) + 1;
            plan.variableWeeklyLeft = weekAmountToSet;
            plan.surplus = plan.surplus + (afkPeriod * plan['dailyleft']); 
            plan.variableDailyLeft = plan.dailyleft;
          }

        }

      }
       
      plan.lastUpdated = this.today.format('YYYY-MM-DDTHH:mm:ss.SSS');
      
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
      data:{leftToSpend:this.activePlan['variableDailyLeft']}  
    })
    dialogRef.afterClosed().subscribe(result => {
      this.recalculatePlan(result);

    })

  }

  recalculatePlan(cost) {

    this.activePlan['currentSpent'] = (this.activePlan['currentSpent'] + cost.cost);
    this.activePlan['currentLeft'] = (this.activePlan['currentLeft'] - cost.cost); 

    this.activePlan['variableDailyLeft'] = Math.round((this.activePlan['variableDailyLeft'] - cost.cost) * 100) /100;
    this.activePlan['variableWeeklyLeft'] = Math.round((this.activePlan['variableWeeklyLeft'] - cost.cost) * 100 ) /100;

    this.planService.updatePlan(this.activePlan['id'], this.activePlan)
      .then(
        res => {
          console.log("Plan updated");
        }
      )


  }

  

}
