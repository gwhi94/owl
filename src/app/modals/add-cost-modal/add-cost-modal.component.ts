import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-add-cost-modal',
  templateUrl: './add-cost-modal.component.html',
  styleUrls: ['./add-cost-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCostModalComponent implements OnInit {

  cost:number;
  leftToSpend:number;
  surplus:number;
  denySpend = false;
  surplusCheck = false;


  costCategories = [
    {category:'Travel', icon:'train', active:false},
    {category:'Food and Drink', icon:'fastfood', active:false},
    {category:'Entertainment', icon:'tv', active:false},
    {category:'Technology', icon:'smartphone', active:false},
    {category:'Bills', icon:'credit_card', active:false},
    {category:'Cash', icon:'money', active:false},
  ];

  selectedCategory = '';



  constructor(public dialogRef: MatDialogRef<AddCostModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {

    this.leftToSpend = this.data.leftToSpend;
    this.surplus = this.data.surplus;
    console.log(this.surplus);
    console.log(this.leftToSpend);
    console.log(this.leftToSpend);
  }

  addCost() {
    if(this.surplusCheck){
      console.log("checked");
      this.cost > this.surplus ? this.denySpend = true: this.dialogRef.close({cost:this.cost,category:this.selectedCategory, usedSurplus:true});
    }else{
      this.cost > this.leftToSpend ? this.denySpend = true : this.dialogRef.close({cost:this.cost,category:this.selectedCategory, usedSurplus:false});
    }   
  }

  activateClass(costCategory, costCategoryButton){
    console.log(costCategory);
    this.selectedCategory = costCategory;
    this.costCategories.forEach(function(link){
      link.active = false;
    });
    costCategoryButton.active = !costCategoryButton.active;
  }


}
