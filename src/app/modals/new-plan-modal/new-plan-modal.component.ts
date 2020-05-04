import { Component, OnInit, Inject} from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialogRef, MAT_DIALOG_DATA, matFormFieldAnimations } from '@angular/material';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PlanService } from '../../services/plan-service';
import { Plan } from '../../models/plan';
import { analytics } from 'firebase';

import { AuthService } from '../../services/auth.service';


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

  uid:string;

  minusCaution:Boolean = false;


  
  data = {
    totalLeft:0,
    weeklyLeft:0, 
    dailyLeft:0,
    days:0,
    totalDays:0,
    weekendCount:0,
    dateRange:{},
    currentSpent:0,
    currentLeft:0,
    variableDailyLeft:0,
    variableWeeklyLeft:0,
    lastUpdated:'',
    excludeWeekends:false,
    uid:''

  }

  constructor(private auth:AuthService, private fb: FormBuilder, private planService:PlanService, public dialogRef: MatDialogRef<NewPlanModalComponent>,
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

   
    formData.uid = this.uid;
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

    this.auth.user$.subscribe(res => {
      this.cleanUp(res.uid);
      this.uid = res.uid
    })


  }

  cleanUp(uid){
    this.planService.getActivePlan(uid)
    .subscribe(res => {
      this.activePlan = res[0];
    })

    if(this.dataPassedFromSet.dataPassedFromSet.excludeWeekends){
      let workDays = this.getWorkDays(moment(),moment().add(this.dataPassedFromSet.dataPassedFromSet.days, 'days'));
      let weekendCount = this.dataPassedFromSet.dataPassedFromSet.days - workDays;
      this.data.weekendCount = weekendCount;
    }

    this.data.days = this.dataPassedFromSet.dataPassedFromSet.days;
    this.data.totalDays = this.dataPassedFromSet.dataPassedFromSet.days;
    this.data.dateRange = this.dataPassedFromSet.dataPassedFromSet.dateRange;
    this.data.excludeWeekends = this.dataPassedFromSet.dataPassedFromSet.excludeWeekends;
    this.rForm.controls.expenses.setValue(this.dataPassedFromSet.dataPassedFromSet.expenses);

    this.rForm.valueChanges.subscribe(()=> {
      this.crunchNumbers(this.rForm.value);
    });
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

  crunchNumbers(form) {  


    if(this.dataPassedFromSet.dataPassedFromSet.weekendCount > 0){
      console.log("excl weekends");

    }
    var daysLeft = this.data.days;           
    let weeks = Math.round(daysLeft / 7);//30 => 4
    
    
    this.data.totalLeft = Math.round((form.moneyIn - form.expenses - form.saving) * 100) /100; //80
    if(this.data.totalLeft < 0){
      this.minusCaution = true;
    }else {
      this.minusCaution = false;
    }
    this.data.weeklyLeft = Math.round(this.data.totalLeft / weeks); //80


    if(this.dataPassedFromSet.dataPassedFromSet.weekendCount > 0){
      this.data.dailyLeft = Math.floor(this.data.totalLeft / (daysLeft - this.dataPassedFromSet.dataPassedFromSet.weekendCount));
    }else if(this.dataPassedFromSet.dataPassedFromSet.weekendCount == 0){
      this.data.dailyLeft = Math.floor(this.data.totalLeft / daysLeft);           
    }    
  }
  
}


