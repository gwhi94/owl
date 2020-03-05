import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewPaymentModalComponent } from '../modals/new-payment-modal/new-payment-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentsService } from '../services/payments-service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  //will have to programmtically apend the year and month to the payment due date
  //all payments recur monthly
  //can have one off payment/set as boolean
  //must clear one offs after payment date reached. 
  //expenses will no longer be manual input at new plan modal
  //payments will total to give the expenses

  private subscription:Subscription;

  payments = [];
  paymentsTotal:number;


  constructor(public dialog: MatDialog, private paymentsService:PaymentsService) { }


  ngOnInit() {
    this.getPayments();
  }

  ngOnDestroy(){

  }

  getPayments(){
    this.subscription = this.paymentsService.getPayments()
      .subscribe(result => {
        this.payments = result;
        console.log(this.payments);
        this.subscription.unsubscribe();
        this.parsePayments();

      })
  }

  parsePayments(){
    let total = 0;
    this.payments.forEach(function(payment){
       total += payment.payload.doc.data().amount
    }) 
    this.paymentsTotal = total;
  }

  addPayment(){
    let dialogRef = this.dialog.open(NewPaymentModalComponent,{
      data:{}

    })
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      this.paymentsService.newPayment(result)
        .then(res => {
          console.log("Payment added");
          this.getPayments();
        })
    })

  }

  deletePayment(payment){
    console.log(payment);
    this.paymentsService.deletePayment(payment)
      .then(res => {
        console.log("Deleted Payment");
        this.getPayments();
      })
  }

}
