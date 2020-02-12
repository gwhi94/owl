import { Component, OnInit, Inject} from '@angular/core';
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
    days:0,
    dateRange:{},
  }

  constructor(private fb: FormBuilder, private planService:PlanService, public dialogRef: MatDialogRef<NewPlanModalComponent>,
     @Inject(MAT_DIALOG_DATA) public dataPassedFromSet: any) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend(); 

    this.rForm = fb.group({
      'name':[null,Validators.compose([Validators.required, Validators.maxLength(40), Validators.minLength(3)])],
      'moneyIn':[null,Validators.compose([Validators.required, Validators.min(1), Validators.max(1000000000)])],
      'expenses':[null,Validators.compose([Validators.min(1), Validators.max(100000000)])],
      'saving':[null, Validators.compose([Validators.min(1), Validators.max(100000000)])],
    });
  
  }

  onSubmit(plan) { 

    //need to add logic in here before saving, to set the current
    //active to false. 

    var formData = this.data;
    var formValue = this.rForm.value;

    //this.getRange(this.rForm.get('dateRange').value);

    //TODO these data values will change so updates need to happen
    
    console.log(formData, formValue);
    formValue.dateRange = formData.dateRange;

     this.planService.newPlan(formData,formValue)
      .then(
        res => {
          console.log("sent");
        }
      )
    this.submitted = true;      
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
    this.data.days = this.dataPassedFromSet.dataPassedFromSet.days;
    this.data.dateRange = this.dataPassedFromSet.dataPassedFromSet.dateRange;

    this.rForm.valueChanges.subscribe(()=> {
      this.crunchNumbers(this.rForm.value);
    });

  }

  crunchNumbers(form) {  
    var daysLeft = this.data.days;        
    this.data.totalLeft = Math.round((form.moneyIn - form.expenses - form.saving) * 100) /100; //80
    this.data.weeklyLeft = Math.round(((this.data.totalLeft / this.data.days) * 5) * 100) /100; //80
    this.data.dailyLeft = Math.round(this.data.totalLeft / daysLeft) * 100 /100;           
    
  }



  
}


