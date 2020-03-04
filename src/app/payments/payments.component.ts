import { Component, OnInit } from '@angular/core';
import { NewPaymentModalComponent } from '../modals/new-payment-modal/new-payment-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  //will have to programmtically apend the year and month to the payment due date
  //all payments recur monthly
  //can have one off payment/set as boolean
  //must clear one offs after payment date reached. 
  //expenses will no longer be manual input at new plan modal

  //payments will total to give the expenses
  

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }


  addPayment(){
    let dialogRef = this.dialog.open(NewPaymentModalComponent,{
      data:{}

    })

    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
    })


  }

}
