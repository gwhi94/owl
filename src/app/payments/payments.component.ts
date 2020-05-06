import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewPaymentModalComponent } from '../modals/new-payment-modal/new-payment-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentsService } from '../services/payments-service';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  animations : [

    trigger('listAnimation', [

      transition('* => *', [

        query(':enter', style({opacity:0}), {optional:true}),
       
        query(':enter', stagger('200ms', [
          animate('1s ease-in', keyframes([
            style({opacity:0, transform:'translateY(-75px)', offset:0}),
            style({opacity:0.5, transform:'translateY(35px)', offset:0.3}),
            style({opacity:1, transform:'translateY(0)', offset:1}),
          ]))
        ]), {optional:true})
      ])
    ])
  ]
})

export class PaymentsComponent implements OnInit, OnDestroy {

  private subscription:Subscription;

  payments = [];
  paymentsTotal:number;
  dateString:string;
  uid:string;


  constructor(private auth:AuthService, public dialog: MatDialog, private paymentsService:PaymentsService) { }




  ngOnInit() {
    this.auth.user$.subscribe(res => {
      this.uid = res.uid;
      this.getPayments(res.uid);
      
    });
    
  }

  ngOnDestroy(){
  }

  getPayments(uid){
    this.subscription = this.paymentsService.getPayments(uid)
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
    console.log("added");
    let dialogRef = this.dialog.open(NewPaymentModalComponent,{
      data:{}

    })
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      if(result.name != undefined){
        this.paymentsService.newPayment(result)
          .then(res => {
            console.log("Payment added");
            this.getPayments(this.uid);
          })
      }
    })

  }

  deletePayment(payment){
    this.paymentsService.deletePayment(payment)
      .then(res => {
        this.getPayments(this.uid);
      })
  }

}
