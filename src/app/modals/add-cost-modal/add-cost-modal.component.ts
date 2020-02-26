import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-cost-modal',
  templateUrl: './add-cost-modal.component.html',
  styleUrls: ['./add-cost-modal.component.scss']
})
export class AddCostModalComponent implements OnInit {

  cost:number;
  denySpend = false;
  leftToSpend:number;
  

  constructor(public dialogRef: MatDialogRef<AddCostModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.leftToSpend = this.data.leftToSpend;
    console.log(this.leftToSpend);
    console.log(this.leftToSpend);
  }

  addCost() {

    this.cost > this.leftToSpend ? this.denySpend = true : this.dialogRef.close({cost:this.cost});

    
  }

}
