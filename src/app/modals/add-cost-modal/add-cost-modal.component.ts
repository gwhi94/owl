import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-cost-modal',
  templateUrl: './add-cost-modal.component.html',
  styleUrls: ['./add-cost-modal.component.scss']
})
export class AddCostModalComponent implements OnInit {

  cost:number;
  

  constructor(public dialogRef: MatDialogRef<AddCostModalComponent>) { }

  ngOnInit() {
  }

  addCost() {
    this.dialogRef.close({cost:this.cost});
  }

}
