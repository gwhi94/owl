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

        

        let today =  moment().format('DD/MM/YYYY');
        let planEnd = result[0].dateRange['end'];


        console.log(today,planEnd);

        var test = moment(new Date());
        var test2 = moment(planEnd);
        console.log(test2,test);
        //update days left
        //need to make sure user cant select past date at new plan
        //result[0].days = 

        console.log(moment(today));

        console.log(planEnd);
        
        console.log(moment().diff(planEnd, 'days'));

        //calculate surplus
        //result[0].surplus = 
        
        console.log(moment(today).diff(moment(result[0].lastUpdated)) * result[0].dailyLeft);
        
        
        
        //this.activePlan = res[0]
      
      
      
      
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
