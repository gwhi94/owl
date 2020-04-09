import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-new-payment-modal',
  templateUrl: './new-payment-modal.component.html',
  styleUrls: ['./new-payment-modal.component.scss']
})
export class NewPaymentModalComponent implements OnInit {

  rForm: FormGroup;
  fieldAlert: string = 'Required';

  constructor(private fb:FormBuilder,public dialogRef: MatDialogRef<NewPaymentModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {this.rForm = fb.group({
    'name':[null,Validators.compose([Validators.required, Validators.maxLength(15), Validators.minLength(3)])],
    'amount':[null,Validators.compose([Validators.required, Validators.min(1), Validators.max(1000000000)])],
    'due':[null,Validators.compose([Validators.required, Validators.min(1), Validators.max(31)])],
  });
 }


  ngOnInit() {
  }

  onSubmit(form){
    console.log(form);


    this.dialogRef.close({
      name:form.name,
      amount:form.amount,
      due:form.due,
    })

  }

}
