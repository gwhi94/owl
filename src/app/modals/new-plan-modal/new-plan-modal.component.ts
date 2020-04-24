import { Component, OnInit, Inject} from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialogRef, MAT_DIALOG_DATA, matFormFieldAnimations } from '@angular/material';
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
  fieldAlert: string = 'Required';

  submitted = false;
  excludeWeekends = false;

  activePlan:Object;
  
  data = {
    totalLeft:0,
    weeklyLeft:0, 
    dailyLeft:0,
    days:0,
    dateRange:{},
    currentSpent:0,
    currentLeft:0,
    variableDailyLeft:0,
    variableWeeklyLeft:0,
    lastUpdated:'',
    excludeWeekends:false

  }

  constructor(private fb: FormBuilder, private planService:PlanService, public dialogRef: MatDialogRef<NewPlanModalComponent>,
     @Inject(MAT_DIALOG_DATA) public dataPassedFromSet: any) {
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend(); 

    this.rForm = fb.group({
      'name':[null,Validators.compose([Validators.required, Validators.maxLength(15), Validators.minLength(3)])],
      'moneyIn':[null,Validators.compose([Validators.required, Validators.min(1), Validators.max(1000000000)])],
      'expenses':[null,Validators.compose([Validators.min(1), Validators.max(100000000)])],
      'saving':[null, Validators.compose([Validators.min(1), Validators.max(100000000)])],
    }); 
  }


  onSubmit(plan) { 

    var formData = this.data;
    var formValue = this.rForm.value;
    formData.currentLeft = formData.totalLeft;
    formData.variableDailyLeft = formData.dailyLeft;
    formData.variableWeeklyLeft = formData.weeklyLeft;
    formData.lastUpdated = moment(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS');

    //satisfying momentJs when plan comes back in for update
    let splitBegin =  formData.dateRange['begin'].split("/");
    formData.dateRange['begin'] = splitBegin[2] + '-' + splitBegin[1] + '-' + splitBegin[0];
    let splitEnd =  formData.dateRange['end'].split("/");
    formData.dateRange['end'] = splitEnd[2] + '-' + splitEnd[1] + '-' + splitEnd[0];

    formValue.dateRange = formData.dateRange;

    if(this.activePlan){
      this.activePlan['activePlan'] = false;
      this.planService.updatePlan(this.activePlan['id'], this.activePlan)
        .then(res => {
          this.savePlan(plan);     
        })
    }else {
      this.savePlan(plan);
    }
  }


  savePlan(plan){
    var formData = this.data;
    var formValue = this.rForm.value;
    
    this.planService.newPlan(formData,formValue)
      .then(
        res => {
          console.log("sent");
          this.dialogRef.close();
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

    this.planService.getActivePlan()
    .subscribe(res => {
      this.activePlan = res[0];
    })

    this.data.days = this.dataPassedFromSet.dataPassedFromSet.days;
    this.data.dateRange = this.dataPassedFromSet.dataPassedFromSet.dateRange;
    this.data.excludeWeekends = this.dataPassedFromSet.dataPassedFromSet.excludeWeekends;
    this.rForm.controls.expenses.setValue(this.dataPassedFromSet.dataPassedFromSet.expenses);

    this.rForm.valueChanges.subscribe(()=> {
      this.crunchNumbers(this.rForm.value);
    });

  }

  crunchNumbers(form) {  

    console.log("hit");
    console.log(this.dataPassedFromSet.dataPassedFromSet.weekendCount);

    if(this.dataPassedFromSet.dataPassedFromSet.weekendCount > 0){
      console.log("excl weekends");

    }
    var daysLeft = this.data.days;           
    let weeks = Math.round(daysLeft / 7);//30 => 4
    
    
    this.data.totalLeft = Math.round((form.moneyIn - form.expenses - form.saving) * 100) /100; //80
    this.data.weeklyLeft = Math.round(this.data.totalLeft / weeks); //80


    if(this.dataPassedFromSet.dataPassedFromSet.weekendCount > 0){
      this.data.dailyLeft = Math.floor(this.data.totalLeft / (daysLeft - this.dataPassedFromSet.dataPassedFromSet.weekendCount));
    }else if(this.dataPassedFromSet.dataPassedFromSet.weekendCount == 0){
      this.data.dailyLeft = Math.floor(this.data.totalLeft / daysLeft);           
    }    
  }
  
}


