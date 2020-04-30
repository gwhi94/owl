import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  currencies = [
    {name:'GBP Pounds', value:'£', active:true},
    {name:'US Dollar', value:'$', active:false},
    {name:'Euro', value:'€', active:false},
  ];

  globalCurrency:String = 'GBP Pounds' ;
  globalLock:Boolean = false;


  ngOnInit() {
  }

  activateClass(currency, currencyButton){
    console.log(currency);
    this.globalCurrency = currency;
    this.currencies.forEach(function(link){
      link.active = false;
    });
    currencyButton.active = !currencyButton.active;
  }

  saveSettings(){
    console.log("fired");
    console.log(this.globalCurrency, this.globalLock);
  }

}
