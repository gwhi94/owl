import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { PaymentsService } from '../../services/payments-service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-set-date-modal',
  templateUrl: './set-date-modal.component.html',
  styleUrls: ['./set-date-modal.component.scss']
})
export class SetDateModalComponent implements OnInit {

  rFormSet: FormGroup;
  dateRange: Object;
  fieldAlert: string = 'Field is Required';
  excludeWeekends = false;
  days: number;
  expenses:number;
  payments:Array<any>;
  paymentsWritable:Array<any> = [];
  selectedPaymentTotal:number = 0;
  minDate = moment().add(1, "days");
  weekendCount:Number = 0;
  ifWeekend:Boolean = false;


  constructor(private auth:AuthService, private errorService:ErrorService, private paymentsService:PaymentsService, private fb: FormBuilder, public dialogRef: MatDialogRef<SetDateModalComponent>) {
    this.rFormSet = fb.group({ 
      'endDate':[null,Validators.required]
    });

   }

  ngOnInit() {

    if(moment().day() == 6 || moment().day() == 0){
      this.ifWeekend = true;
    }

    
    this.auth.user$.subscribe(res => {
      this.getPayments(res.uid)    
    },
    error => {
      this.errorService.showError("Failed to retrieve user details");
    });

  }

  getPayments(uid){
    this.paymentsService.getPayments(uid)
      .subscribe(res => {
        this.payments = res;
        this.addActiveProp();
      },
      error => {
        this.errorService.showError("Failed to retrieve payments");
      })

  }

  addActiveProp(){
    //array from firebase is not writable, throws a silent error
    this.payments.forEach((item) => {
      this.paymentsWritable.push(item.payload.doc.data())  
    })       
    this.paymentsWritable.forEach((item) => {
      item.active = false;
    })

  }

  selectPayment(payment){
    payment.active ?  this.selectedPaymentTotal = this.selectedPaymentTotal - payment.amount : this.selectedPaymentTotal = this.selectedPaymentTotal + payment.amount;    
    payment.active ? payment.active = false : payment.active = true; 
  }

  onSubmit(){ 
   

    let endString = moment(this.rFormSet.get('endDate').value).format("YYYY-MM-DD");
    let endMoment = moment(endString);

    console.log(endString);

   this.getRange(moment(), endMoment);
  }

  public getRange(begin, end){

    console.log(end);
    
    var dateObject = {begin:begin, end:end};
    var start = dateObject.begin;
    var end = dateObject.end;

    let difference = moment.duration(end.diff(start));

    var days = difference.asDays() + 1;
    //number of days in range
    //use while loop to start at end day and loop towards start using days as counter

    var weekendCount = 0;
    //using clone as it was causing issues as the moment objects are mutable
    var dateToCompare = end.clone();  
    console.log(dateToCompare);
    console.log(dateObject);
    this.days = Math.floor(days);
    
    
    while(days > 0) {
      var dateToCompareFormat = dateToCompare.format('dddd');              
      if(dateToCompareFormat == 'Saturday' || dateToCompareFormat == 'Sunday'){
        weekendCount ++
      }
      dateToCompare = dateToCompare.subtract(1, "days");
      days --; 
    }
    
    if(this.excludeWeekends){
      this.weekendCount = weekendCount;
    } 


  this.dateRange = {
      begin:dateObject.begin.format('DD/MM/YYYY'),
      end:dateObject.end.format('DD/MM/YYYY')
    }

    console.log(this.dateRange);
    console.log(this.weekendCount);

   this.dialogRef.close({weekendCount:this.weekendCount, days:this.days,totalDays:this.days, dateRange:this.dateRange, excludeWeekends:this.excludeWeekends, expenses:this.selectedPaymentTotal});
    
  }

}
