import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan-service';
import { AddCostModalComponent } from '../modals/add-cost-modal/add-cost-modal.component';
import { EndPlanModalComponent } from '../modals/end-plan-modal/end-plan-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';

import { DataService } from '../services/data-service';
import { PaymentsService } from '../services/payments-service';



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
  mostSpent:String = '';
  spentToday:Number;
  spentThisWeek:Number;
  percentageSpent:Number;
  mostSpentColorIndicator:String;
  payments = [];
  upcomingPayments = [];
  completedPayments = [];

  today = moment(moment());  


  constructor(private dataService:DataService, private paymentsService:PaymentsService, private snackBar:MatSnackBar, private planService:PlanService, public dialog: MatDialog ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend(); 
   }


  public barChartOptions: ChartOptions = {
    elements :{
      arc : {
        borderWidth:0
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false
      },
      scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            gridLines: {
                display:false
            }   
        }]
    }
  };
  public barChartLabels: Label[] = [
    ['Travel'],
    ['Food & Drink'],
    ['Entertainment'],
    ['Technology'],
    ['Bills'],
    ['Cash'] 
      ];
  public barChartData: SingleDataSet;
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];
  private barChartColors = [
    {
      backgroundColor: [
        '#42a5f5',
        '#fbc02d',
        '#ff77a9',
        '#80e27e',
        '#ef5350',
        '#9575cd'
    ]
    }
  
]

  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log("destroyed");
  }

  ngOnInit() {
     
    this.subscription = this.planService.getActivePlan()
      .subscribe(result => {   
        this.activePlan = result[0];
        this.inspectPlan(this.activePlan);
        this.setBreakdown();
        this.subscription.unsubscribe();           
      });
 
      //need to put this in if below certain percentage turn red.
      this.planProgessColor = 'green';
      this.planProgressPercentage = 50;
  }


    inspectPlan(plan){

      if(moment(moment().format('YYYY-MM-DD')).isSame(moment(plan.dateRange.end))){
        console.log("is same");

        this.dialog.open(EndPlanModalComponent);

        
      }else {
        console.log("not same");
      }



      console.log("inspect plan called");    
      if(plan.excludeWeekends){
        if(moment().day() == 0 || moment().day() == 6){
          console.log("locking plan as it is weekend and excluding weekends")
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
          if(moment(this.today).diff(plan.weekUpdated, 'days') == 5){
            plan.variableWeeklyLeft = plan.weeklyLeft;
            plan.weekUpdated = this.today.format('YYYY-MM-DD'); 
          }else{
            console.log("Week hasnt passed yet");
          }
        }else{       
          //this logic works and so does reset
          if(moment(this.today).diff(plan.weekUpdated, 'days') == 7){
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
              this.sendSpentToday(plan);
              this.sendSpentThisWeek(plan);  
              this.sendPercentageSpent(plan);
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
            this.sendSpentToday(plan);
            this.sendSpentThisWeek(plan); 
            this.sendPercentageSpent(plan); 
            
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
      if(result){
        console.log(result);
        this.snackBar.open('Cost added', undefined, {
          duration: 5000,
          panelClass: ['success', 'app-alert'],
          verticalPosition: 'top'
        });
          
        this.recalculatePlan(result);
      }
    })

  }

  recalculatePlan(costData) {

    this.activePlan['currentSpent'] = (this.activePlan['currentSpent'] + costData.cost);
    this.activePlan['currentLeft'] = (this.activePlan['currentLeft'] - costData.cost); 

    this.activePlan['variableDailyLeft'] = Math.round((this.activePlan['variableDailyLeft'] - costData.cost) * 100) /100;
    this.activePlan['variableWeeklyLeft'] = Math.round((this.activePlan['variableWeeklyLeft'] - costData.cost) * 100 ) /100;

    if(this.activePlan['costCategories'].some(c => c.category == costData.category)){
      console.log("Exists");
      
      for(let i = 0 ; i < this.activePlan['costCategories'].length; i++){
        if(this.activePlan['costCategories'][i].category == costData.category){
          console.log("Incrementing");
          this.activePlan['costCategories'][i].count = this.activePlan['costCategories'][i].count + costData.cost;
        }
      }
    }else {
      console.log("Doesnt Exist");
      this.activePlan['costCategories'].push({category:costData.category, count:costData.cost});
    }



    
    this.planService.updatePlan(this.activePlan['id'], this.activePlan)
      .then(
        res => {
          console.log("Plan updated");
          this.setBreakdown();
          this.sendSpentToday(this.activePlan);
          this.sendSpentThisWeek(this.activePlan);
          this.sendPercentageSpent(this.activePlan);
        }
      )


  }


  setBreakdown(){
    let today = moment().format('DD');
    let upcoming = [];
    let completed = [];

    this.paymentsService.getPayments()
      .subscribe(res => {
        this.payments = res;


        for(let i = 0; i < this.payments.length;i++){
          if(this.payments[i].payload.doc.data().due > today){
            if(upcoming.length <=3)
            upcoming.push(this.payments[i].payload.doc.data());           
          }else{
            if(completed.length <=3 )
            completed.push(this.payments[i].payload.doc.data());
          }
        }

        this.completedPayments = completed.sort((a, b) => a.due - b.due);
        this.upcomingPayments = upcoming.sort((a, b) => a.due - b.due);

      })

    let costObj = {
      Travel:0,
      foodAndDrink:0,
      Entertainment:0,
      Technology:0,
      Bills:0,
      Cash:0
    }
    

    for(let i = 0 ; i < this.activePlan['costCategories'].length;i++){
      if(this.activePlan['costCategories'][i].category == 'Travel'){
        costObj.Travel = this.activePlan['costCategories'][i].count

      }else if (this.activePlan['costCategories'][i].category == 'Food and Drink'){
        costObj.foodAndDrink = this.activePlan['costCategories'][i].count
      
      }else if(this.activePlan['costCategories'][i].category == 'Entertainment'){
        costObj.Entertainment = this.activePlan['costCategories'][i].count
     
      }else if(this.activePlan['costCategories'][i].category == 'Technology'){
        costObj.Technology = this.activePlan['costCategories'][i].count
      
      }else if (this.activePlan['costCategories'][i].category == 'Bills'){
        costObj.Bills = this.activePlan['costCategories'][i].count
      
      }else if (this.activePlan['costCategories'][i].category == 'Cash'){
        costObj.Cash = this.activePlan['costCategories'][i].count

      }
    }

    this.mostSpent = Object.keys(costObj).reduce((a, b) => costObj[a] > costObj[b] ? a:b);
    

    this.sendMostSpent(this.mostSpent);
   
    if(this.mostSpent == 'foodAndDrink')this.mostSpent = 'Food and Drink';   
    if(this.activePlan['costCategories'].length == 0)this.mostSpent = '';


    this.barChartData = [
        costObj.Travel,
        costObj.foodAndDrink,
        costObj.Entertainment,
        costObj.Technology,
        costObj.Bills,
        costObj.Cash
      ];
  }


  getCatColor(){
    //getting called multiple times
    switch(this.mostSpent){
      case 'Food and Drink':
        this.mostSpentColorIndicator = 'food-drink-color';
        break;
      case 'Travel':
        this.mostSpentColorIndicator = 'travel-color';
        break;
      case 'Entertainment':
        this.mostSpentColorIndicator = 'entertainment-color';
        break;
      case 'Technology':
        this.mostSpentColorIndicator = 'technology-color';
        break;
      case 'Bills':
        this.mostSpentColorIndicator = 'bills-color';
          break;
      case 'Cash':
        this.mostSpentColorIndicator = 'Cash';
    }
    
    return this.mostSpentColorIndicator;    
  }

  sendMostSpent(send){
    console.log(send);
    this.dataService.currentMostSpent.subscribe(mostSpent => this.mostSpent = send)
    this.dataService.changeMostSpent(this.mostSpent);
  }

  sendSpentToday(plan){
    console.log("hit");

    let spentToday = plan.dailyleft - plan.variableDailyLeft;
    this.dataService.currentSpentToday.subscribe(spentToday => this.spentToday = spentToday)
    this.dataService.changeSpentToday(spentToday);

    //make sure these are called on update


  }

  sendSpentThisWeek(plan){
    console.log("hit2");
  
    let spentThisWeek = plan.weeklyLeft - plan.variableWeeklyLeft;
    console.log(spentThisWeek);
    this.dataService.currentSpentThisWeek.subscribe(spentThisWeek => this.spentThisWeek = spentThisWeek)
    this.dataService.changeSpentThisWeek(spentThisWeek);


  }

  sendPercentageSpent(plan){
    let percentageSpent = Math.round(plan.currentSpent * (100/plan.totalLeft) * 100 ) / 100;

    console.log(percentageSpent);

    this.dataService.currentPercentageSpent.subscribe(percentageSpent => this.percentageSpent = percentageSpent)
    this.dataService.changePercentageSpent(percentageSpent);
  }
}
