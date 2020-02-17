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

        console.log(result);

        var plan = result[0];

        
        //updating days left
        let today =  moment(moment());    
        let planEnd = moment(plan['dateRange']['end']);
        plan.days = planEnd.diff(today, 'days');

        //calculating any surplus
        //need to do a check here to only do this if last updated is not today
        //otherwise we get multiplication by zero and it resets the surplus.
        let lastUpdated = moment(plan['lastUpdated']);
        let afkPeriod  = today.diff(lastUpdated, 'days');       
        plan.surplus = (afkPeriod * plan['dailyleft']);
        //plan.lastUpdated = 
        plan.lastUpdated = today.format('YYYY-MM-DD');
        //updating plan before setting as active plan
        console.log(plan);

       




        
      
      
      });


      //when active plan is got
      //get todays date and the end plan date and recalculate the days left
      //update days left.
      //add last logged in field
      //take last logged in and find diff
      //between todays date and last logged in
      //multiply these days by the dailyLeft and you have the surplus
      //add the suplus and update plan





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

    console.log(this.activePlan);

    this.activePlan['currentSpent'] = this.activePlan['currentSpent'] + cost;
    this.activePlan['currentLeft'] = this.activePlan['currentLeft'] - this.activePlan['currentSpent']; 
    

    


  }

  

}
