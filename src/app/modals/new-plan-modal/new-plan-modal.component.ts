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

    var formData = this.data;
    var formValue = this.rForm.value;

    //this.getRange(this.rForm.get('dateRange').value);

    //TODO these data values will change so updates need to happen


    
    





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

    console.log(this.dataPassedFromSet);

    this.rForm.valueChanges.subscribe(()=> {
      this.crunchNumbers(this.rForm.value);
    });


  }

  crunchNumbers(form) {
    console.log(form);
  
    

    console.log(this.excludeWeekends);


    var daysLeft = this.data.days;


    if(this.data.days !== 0){
      
      
      this.data.totalLeft = (form.moneyIn - form.expenses - form.saving); //80
      this.data.weeklyLeft = (this.data.totalLeft / this.data.days) * 5; //80
      this.data.dailyLeft = this.data.totalLeft / daysLeft;           
    } 
  }



  
}


