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
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  activePlan:Object;
  pulledPlan:Object;
  planProgressPercentage:number = 0;
  planProgressColor:string = 'green';
  currentDate:string; 
  lockPlanForWeekend = false;
  mostSpent:String = '';
  spentToday:Number;
  spentThisWeek:Number;
  percentageSpent:Number;
  mostSpentColorIndicator:String;
  payments = [];
  upcomingPayments = [];
  completedPayments = [];
  currency:string = '£';
  globalLock = false;
  uid:string;

  //ADD A NEW PROP = SURPLUS COST TO MINUS FROM SURPLUS CALCS
  
  //DO NOT INCREMENT WITHOUT ADDING COST
  testingIncrement:number = 0;
  //DO NOT INCREMENT WITHOUT ADDING COST
  //this is one behind spredsheet tracking number

  today = moment(moment().add(this.testingIncrement, 'days'));
  
  todayFormatted = this.today.format("DD-MM-YYYY");



  constructor(private settingsService:SettingsService, private auth:AuthService, private router:Router, private dataService:DataService, private paymentsService:PaymentsService, private snackBar:MatSnackBar, private planService:PlanService, public dialog: MatDialog ) {
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
  public barChartColors = [
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

    this.auth.user$.subscribe(res => {
      this.getActivePlan(res.uid);
      this.getSettings(res.uid);
      this.uid = res.uid;
      
    });

  }

  getSettings(uid){
    this.settingsService.getSettings(uid)
    .subscribe(res => {
      this.currency = res[0]['currency'];
      this.globalLock = res[0]['globalLock'];     
    })
  }

  getActivePlan(uid){
    this.subscription = this.planService.getActivePlan(uid)
    .subscribe(result => {
      this.activePlan = result[0];
      if(this.activePlan) {
        this.inspectPlan(this.activePlan);
        this.setBreakdown();
      }        
      this.subscription.unsubscribe();           
    });

  }

    inspectPlan(plan){
      console.log(moment(plan.dateRange.end));
      console.log(moment().add(this.testingIncrement, 'days'));

        console.log("Plan still active");   
      if(plan.excludeWeekends){
        if(moment().add(this.testingIncrement, 'days').day() == 0 || moment().add(this.testingIncrement, 'days').day() == 6){
          console.log("WEEKEND -- LOCK PLAN")
          this.lockPlanForWeekend = true;
        }else {
          this.lockPlanForWeekend = false;
        }        
      }            
      //this logic works and so does reset
      if(moment(this.today).diff(plan.weekUpdated, 'days') == 7){
        console.log("week passed 7 days");
        plan.variableWeeklyLeft = plan.weeklyLeft;
        plan.weekUpdated = this.today.format('YYYY-MM-DD'); 
      }
            
    this.updateAfkPlan(plan);     
            
    }

    setProgressBar(){
      this.planProgressPercentage = this.activePlan['variableDailyLeft'] * (100/this.activePlan['dailyleft']);

      if (this.planProgressPercentage < 50 && this.planProgressPercentage > 25){
          this.planProgressColor = '#fb8c00';
      }else if(this.planProgressPercentage < 25){
          this.planProgressColor = '#d32f2f';
      }else if(this.planProgressPercentage > 50){
          this.planProgressColor = '#1eb980';
      }

    }

  
    updateAfkPlan(plan){        
      let planEnd = moment(plan['dateRange']['end']);
      plan.days = planEnd.diff(this.today, 'days') + 1;

      if(this.activePlan['excludeWeekends']){
        if(!this.lockPlanForWeekend){

          console.log(moment(plan.dateRange.begin));
          console.log(this.today);

          //Surplus is adding if plan starts on a weekend
          let weekDays = (this.getElapsedWorkDays(moment(plan.dateRange.begin), this.today));
          console.log(weekDays);
          if(weekDays > 0){
            this.activePlan['surplus'] = ((weekDays * plan.dailyleft) - this.activePlan['currentSpent']) - this.activePlan['surplusSpent'];
          }           
        }
            
      }else{
        let daysGone = this.activePlan['totalDays'] - this.activePlan['days'];
        console.log(daysGone);
        if(daysGone > 0){
          this.activePlan['surplus'] = ((daysGone * plan.dailyleft) - this.activePlan['currentSpent']) -  - this.activePlan['surplusSpent'];     
        }
      }

      let lastUpdated = moment(plan['lastUpdated']);
      let afkPeriod  = this.today.diff(lastUpdated, 'days');   

      console.log(afkPeriod);
      console.log(lastUpdated);

      if(afkPeriod == 1){
        console.log("User logged in yesterday");       
        if(!this.lockPlanForWeekend){
          plan.variableDailyLeft = plan['dailyleft']; 
        }
      }

      if(afkPeriod > 1){
        console.log("1");
        if(plan.excludeWeekends){
          console.log("2");
          if(afkPeriod > 7){                  
              plan.variableWeeklyLeft = plan.weeklyLeft;
              plan.variableDailyLeft = plan.dailyleft;                                   
          } else if(afkPeriod <= 7){    
            console.log("3");
              if(this.today.diff(moment(plan.weekUpdated), 'days') > 7){
                plan.variableWeeklyLeft = plan.weeklyLeft;
                let newWeekUpdated = (moment(plan.weekUpdated).add(7, 'days'));
                plan.weekUpdated = newWeekUpdated.format("YYYY-MM-DD");
              }                  
              plan.variableDailyLeft = plan.dailyleft;

            }        
        }else{
         if (afkPeriod > 7){
            plan.variableWeeklyLeft = plan.weeklyLeft;
            plan.variableDailyLeft = plan.dailyleft;
          }else if(afkPeriod <= 7){     
            if(this.today.diff(moment(plan.weekUpdated), 'days') > 7){
                plan.variableWeeklyLeft = plan.weeklyLeft;
                let newWeekUpdated = (moment(plan.weekUpdated).add(7, 'days'));
                plan.weekUpdated = newWeekUpdated.format("YYYY-MM-DD");
            }
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
            this.setProgressBar();
            this.sendSpentToday(plan);
            this.sendSpentThisWeek(plan); 
            this.sendPercentageSpent(plan);  
            
          if(moment(plan.dateRange.end).isBefore(this.today)){
            console.log("Ending Plan");
            this.dialog.open(EndPlanModalComponent);
            //set this plan to inactive. 
            plan.activePlan = false;
            this.planService.updatePlan(plan.id, plan)
              .then(res => {
                console.log("Updated");
                this.activePlan = undefined;
              })                        
            }         
          }
        )  
  }

  getElapsedWorkDays(a, b) {
    var days = b.diff(a, 'days');
    var start = a.day();
    var count = 0;
    for (var i = 0; i < days; i++) {
      start++;
      if (start > 6)
        start = 0;
      if (start > 0 && start < 6)
        count++;
    }
    return count;
  }


  getWorkDays(start, end){

    console.log(start, end);

    var first = start.clone().endOf('week'); // end of first week
    console.log(first);
    var last = end.clone().startOf('week'); // start of last week
    console.log(last);
    var days = last.diff(first,'days') * 5 / 7; // this will always multiply of 7
    console.log(days);
    var wfirst = first.day() - start.day(); // check first week
    console.log(wfirst);
    if(start.day() == 0) --wfirst; // -1 if start with sunday 
    var wlast = end.day() - last.day(); // check last week
    if(end.day() == 6) --wlast; // -1 if end with saturday
  
    return (Math.round((wfirst + days + wlast))) -1; // get the total

  }

addCost(){

if(!this.lockPlanForWeekend && !this.globalLock)

    if(!this.lockPlanForWeekend && this.activePlan['variableDailyLeft'] > 0){
      if(this.activePlan['variableDailyLeft'] > 0){
        let dialogRef = this.dialog.open(AddCostModalComponent, {  
          data:{leftToSpend:this.activePlan['variableDailyLeft'], surplus:this.activePlan['surplus']}  
        })
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.snackBar.open('Cost added', undefined, {
              duration: 3000,
              panelClass: ['success', 'app-alert'],
              verticalPosition: 'top'
            });
    
            if(result.usedSurplus){
              this.activePlan['surplusSpent'] = this.activePlan['surplusSpent'] + result.cost;
              this.activePlan['surplus'] = this.activePlan['surplus'] - result.cost;

              this.planService.updatePlan(this.activePlan['id'], this.activePlan)
                .then(
                  res => {
                    console.log("updated plan");
                  }
                )
    
            }else{
              console.log("!used surplus");
              this.recalculatePlan(result);
            }               
          }
        })  
      }   
    }
    
  }

  recalculatePlan(costData) {

    this.activePlan['currentSpent'] = (this.activePlan['currentSpent'] + costData.cost);
    this.activePlan['currentLeft'] = (this.activePlan['currentLeft'] - costData.cost); 

    this.activePlan['variableDailyLeft'] = (this.activePlan['variableDailyLeft'] - costData.cost).toFixed(2);
    this.activePlan['variableWeeklyLeft'] = (this.activePlan['variableWeeklyLeft'] - costData.cost).toFixed(2);

    if(this.activePlan['costCategories'].some(c => c.category == costData.category)){
      
      for(let i = 0 ; i < this.activePlan['costCategories'].length; i++){
        if(this.activePlan['costCategories'][i].category == costData.category){
          this.activePlan['costCategories'][i].count = this.activePlan['costCategories'][i].count + costData.cost;
        }
      }
    }else {
      this.activePlan['costCategories'].push({category:costData.category, count:costData.cost});
    }
    
    this.planService.updatePlan(this.activePlan['id'], this.activePlan)
      .then(
        res => {
          console.log("Plan updated");
          this.setBreakdown();
          this.setProgressBar();
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

    this.paymentsService.getPayments(this.uid)
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
    this.dataService.currentMostSpent.subscribe(mostSpent => this.mostSpent = send)
    this.dataService.changeMostSpent(this.mostSpent);
  }

  sendSpentToday(plan){
    let spentToday = plan.dailyleft - plan.variableDailyLeft;
    this.dataService.currentSpentToday.subscribe(spentToday => this.spentToday = spentToday)
    this.dataService.changeSpentToday(spentToday);

    //make sure these are called on update


  }

  sendSpentThisWeek(plan){  
    let spentThisWeek = plan.weeklyLeft - plan.variableWeeklyLeft;
    this.dataService.currentSpentThisWeek.subscribe(spentThisWeek => this.spentThisWeek = spentThisWeek)
    this.dataService.changeSpentThisWeek(spentThisWeek);


  }

  sendPercentageSpent(plan){
    let percentageSpent = Math.round(plan.currentSpent * (100/plan.totalLeft) * 100 ) / 100;
    this.dataService.currentPercentageSpent.subscribe(percentageSpent => this.percentageSpent = percentageSpent)
    this.dataService.changePercentageSpent(percentageSpent);
  }
}
