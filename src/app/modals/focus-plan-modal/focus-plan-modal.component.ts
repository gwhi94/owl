import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';

@Component({
  selector: 'app-focus-plan-modal',
  templateUrl: './focus-plan-modal.component.html',
  styleUrls: ['./focus-plan-modal.component.scss']
})
export class FocusPlanModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend(); 
   }

  
  public barChartOptions: ChartOptions = {
    elements :{
      arc : {
        borderWidth:0
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false
      },
      scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            gridLines: {
                display:false
            }   
        }]
    }
  };
  public barChartLabels: Label[] = [
    ['Travel'],
    ['Food & Drink'],
    ['Entertainment'],
    ['Technology'],
    ['Bills'],
    ['Cash'] 
      ];
  public barChartData: SingleDataSet;
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];
  private barChartColors = [
    {
      backgroundColor: [
        '#42a5f5',
        '#fbc02d',
        '#ff77a9',
        '#80e27e',
        '#ef5350',
        '#9575cd'
    ]
    }
  
]

  ngOnInit() {
    console.log(this.data);

    let costObj = {
      Travel:0,
      foodAndDrink:0,
      Entertainment:0,
      Technology:0,
      Bills:0,
      Cash:0
    }
    

    for(let i = 0 ; i < this.data.inFocusPlan['costCategories'].length;i++){
      if(this.data.inFocusPlan['costCategories'][i].category == 'Travel'){
        costObj.Travel = this.data.inFocusPlan['costCategories'][i].count

      }else if (this.data.inFocusPlan['costCategories'][i].category == 'Food and Drink'){
        costObj.foodAndDrink = this.data.inFocusPlan['costCategories'][i].count
      
      }else if(this.data.inFocusPlan['costCategories'][i].category == 'Entertainment'){
        costObj.Entertainment = this.data.inFocusPlan['costCategories'][i].count
     
      }else if(this.data.inFocusPlan['costCategories'][i].category == 'Technology'){
        costObj.Technology = this.data.inFocusPlan['costCategories'][i].count
      
      }else if (this.data.inFocusPlan['costCategories'][i].category == 'Bills'){
        costObj.Bills = this.data.inFocusPlan['costCategories'][i].count
      
      }else if (this.data.inFocusPlan['costCategories'][i].category == 'Cash'){
        costObj.Cash = this.data.inFocusPlan['costCategories'][i].count

      }
    }

    this.barChartData = [
        costObj.Travel,
        costObj.foodAndDrink,
        costObj.Entertainment,
        costObj.Technology,
        costObj.Bills,
        costObj.Cash
      ];

      console.log(this.barChartData);
  }
}


