import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
