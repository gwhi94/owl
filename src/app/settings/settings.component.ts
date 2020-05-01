import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService, private auth:AuthService) { }

  currencies = [
    {name:'GBP Pounds', value:'£', active:true},
    {name:'US Dollar', value:'$', active:false},
    {name:'Euro', value:'€', active:false},
  ];

  globalCurrency:String = 'GBP Pounds' ;
  globalLock:Boolean = false;
  userSettings:Object;
  uid:string;


  ngOnInit() {

    this.auth.user$.subscribe(res => {
      this.uid = res.uid
      this.getSettings(res.uid)
    });


  }

  getSettings(uid){

    this.settingsService.getSettings(uid)
      .subscribe(res => {
        if(res.length > 0){
          console.log(res)
          this.userSettings = res[0];
        }else {
          console.log("Nothing returned, no settings");
          this.userSettings = {uid:uid, currency:'', globalLock:Boolean}
        }
      })
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
    if(this.userSettings['currency'] !== this.globalCurrency){
      console.log("Currency Changed");
      this.userSettings['currency'] = this.globalCurrency;
    }

    if(this.userSettings['globalLock'] !== this.globalLock){
      console.log("Global Lock Changed");
      this.userSettings['globalLock'] = this.globalLock;
    }

    console.log(this.userSettings);
    console.log(this.globalCurrency, this.globalLock);
  }

}
