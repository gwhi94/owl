import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PlanService } from '../../services/plan-service';
import { Plan } from '../../models/plan';
import { analytics } from 'firebase';

@Component({
  selector: 'app-new-plan-modal',
  templateUrl: './new-plan-modal.component.html',
  styleUrls: ['./new-plan-modal.component.scss']
})


export class NewPlanModalComponent implements OnInit {

  rForm: FormGroup;
  plan: any;
  name: string = '';
  moneyIn: number;
  expenses:number;
  saving:number;
  totalLeft:number;
  weeklyLeft:number;
  dailyLeft:number;
  dateRange:{};
  days:number;
  weekendCount:number;
  fieldAlert: string = 'Field is Required';

  submitted = false;
  excludeWeekends = false;
  
  data = {
    totalLeft:0,
    weeklyLeft:0, 
    dailyLeft:0,
    dateRange:{},
    days:0,
    weekendCount:0
  }

  constructor(private fb: FormBuilder, private planService:PlanService, public dialogRef: MatDialogRef<NewPlanModalComponent>) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend(); 

    this.rForm = fb.group({
      'name':[null,Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3)])],
      'moneyIn':[null,Validators.compose([Validators.required, Validators.min(1), Validators.max(1000000000)])],
      'expenses':[null,Validators.compose([Validators.min(1), Validators.max(100000000)])],
      'saving':[null, Validators.compose([Validators.min(1), Validators.max(100000000)])],
      'dateRange':[null,Validators.required],
    });

    

  }

  onSubmit(plan) { 
    this.submitted = true;
    console.log(this.plan, this.data);

    this.name = plan.name;
    this.moneyIn = plan.moneyIn;
    this.expenses = plan.expenses;
    this.saving = plan.saving;
    this.dateRange = plan.dateRange; 

    //make firebase service call here

    let newPlan = this.data;

    this.planService.addPlan(newPlan as Plan)
      .subscribe(plan => {
        this.closeDialog(plan);
      });

     
  }

  closeDialog(plan) {
    this.dialogRef.close({data:plan});
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend :{
      position:'left'
    }
  };
  public pieChartLabels: Label[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: SingleDataSet = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  ngOnInit() {

    this.rForm.valueChanges.subscribe(()=> {
      this.crunchNumbers(this.rForm.value);
    });
    this.rForm.get('dateRange').valueChanges.subscribe(val => {
      this.getRange(this.rForm.get('dateRange').value);
    }) 

  }

  public setDays() {
    if(this.data.weekendCount !== 0 && this.excludeWeekends){
      this.data.days = this.data.days - this.data.weekendCount;
    }  
  }

  crunchNumbers(form) {
    console.log(form);
  
    console.log(form.moneyIn, form.saving, form.expenses);

    console.log(this.excludeWeekends);

    var moneyIn = form.moneyIn; //100
    var expenses = form.expenses; //10
    var saving = form.saving; //10
    
    var daysLeft = this.data.days;


    if(this.data.days !== 0){

      if(this.excludeWeekends) {
        
        console.log("here");
        daysLeft = daysLeft - this.data.weekendCount}; 
        console.log(daysLeft);
     
         this.data.totalLeft = (form.moneyIn - form.expenses - form.saving); //80
         this.data.weeklyLeft = (this.data.totalLeft / this.data.days) * 5; //80
         this.data.dailyLeft = this.data.totalLeft / daysLeft;
    
    } 
  }

  //first problem, dateRange is suffering from lag in the RF value changes. 
  //value changes is a step behind again, fix that.

  public getRange(dateRange){
    console.log(dateRange);
    var start = dateRange['begin'];
    var end = dateRange['end'];
    

    let difference = moment.duration(end.diff(start));
    var days = difference.asDays() + 1;
    //number of days in range
    //use while loop to start at end day and loop towards start using days as counter


    var weekendCount = 0;
    var dateToCompare = end;  
    this.data.days = days;
    
    
    while(days > 0) {
      var dateToCompareFormat = dateToCompare.format('dddd');              
      if(dateToCompareFormat == 'Saturday' || dateToCompareFormat == 'Sunday'){
        weekendCount ++
      }
      dateToCompare = dateToCompare.subtract(1, "days");
      days --;

    
    }
    this.data.weekendCount = weekendCount;
    weekendCount = weekendCount;
  }

  
}


