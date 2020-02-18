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

  constructor(private planService:PlanService, public dialog: MatDialog ) { }

  ngOnInit() {
   
    this.planService.getActivePlan()
      .subscribe(result => {

        var plan = result[0];         
          let today =  moment(moment());    
          //only update days left and surplus if plan is more than a day old
          if(!moment(plan.lastUpdated).isSame(today, 'd')){  
            //updating days left      
            let planEnd = moment(plan['dateRange']['end']);
            plan.days = planEnd.diff(today, 'days');

            //calculating any surplus
            //need to do a check here to only do this if last updated is not today
            //otherwise we get multiplication by zero and it resets the surplus.
            let lastUpdated = moment(plan['lastUpdated']);
            let afkPeriod  = today.diff(lastUpdated, 'days');       
            
            if(afkPeriod != 0){
              plan.surplus = plan.surplus + (afkPeriod * plan['dailyleft']);        
            }
            plan.lastUpdated = today.format('YYYY-MM-DD');
            plan.variableDailyLeft = plan.dailyLeft;
        
            //updating plan before setting as active plan
            this.planService.updatePlan(plan.id, plan)
              .then(
                res => {
                  console.log("Plan updated");
                }
              )
          }else {
            console.log("Plan has been updated today");
          }
          this.activePlan = plan;         
      });
    //need to put this in if below certain percentage turn red.
      this.planProgessColor = 'green';
      this.planProgressPercentage = 50;
  }

  updatePlan(plan){
    console.log(plan);

  }

  addCost(){
    console.log("adding cost");

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

    this.activePlan['variableDailyLeft'] =  (this.activePlan['variableDailyLeft'] - cost.cost);

    //need to be recalculating total left and left this week
    //total left is a running count so am free to manipulate that 
    //left this week is a tick amount like daily left so will need a variable weekly left as well.

    
    //when daily left hits zero, no more payments can be added(yet)
    //this means that the original daily left never needs to be recalculated.

    





  }

  

}
