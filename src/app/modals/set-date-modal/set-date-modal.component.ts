import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { PaymentsService } from '../../services/payments-service';


@Component({
  selector: 'app-set-date-modal',
  templateUrl: './set-date-modal.component.html',
  styleUrls: ['./set-date-modal.component.scss']
})
export class SetDateModalComponent implements OnInit {

  rFormSet: FormGroup;
  dateRange:{};
  fieldAlert: string = 'Field is Required';
  excludeWeekends = false;
  days: number;
  expenses:number;


  constructor(private paymentsService:PaymentsService, private fb: FormBuilder, public dialogRef: MatDialogRef<SetDateModalComponent>) {
    this.rFormSet = fb.group({
      'dateRange':[null,Validators.required]
    });

   }

  ngOnInit() {

    this.paymentsService.getPayments()
      .subscribe(res => {
        this.calculateExpenses(res);

      })
  }

  calculateExpenses(payments){
    console.log(payments);
    let total = 0;

    payments.forEach(element => {
      total += element.payload.doc.data().amount;
    });

    this.expenses = total;
  }

  onSubmit(){
    this.getRange(this.rFormSet.get('dateRange').value);

  }

  
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
    this.days = days;
    
    
    while(days > 0) {
      var dateToCompareFormat = dateToCompare.format('dddd');              
      if(dateToCompareFormat == 'Saturday' || dateToCompareFormat == 'Sunday'){
        weekendCount ++
      }
      dateToCompare = dateToCompare.subtract(1, "days");
      days --;
  
    }
    
    if(this.excludeWeekends){
      this.days = this.days - weekendCount;
    }
    
    var formValue = this.rFormSet.value;
    this.dateRange = {
      begin:moment(formValue.dateRange.begin).format('DD/MM/YYYY'),
      end:moment(formValue.dateRange.end).format('DD/MM/YYYY')
    }


    this.dialogRef.close({days:this.days, dateRange:this.dateRange, excludeWeekends:this.excludeWeekends, expenses:this.expenses});
    
  }



}
