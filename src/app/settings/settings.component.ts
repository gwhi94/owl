import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService, private auth:AuthService, private snackBar:MatSnackBar) { }

  currencies = [
    {name:'GBP Pounds', value:'£', active:true},
    {name:'US Dollar', value:'$', active:false},
    {name:'Euro', value:'€', active:false},
  ];

  globalCurrency:String = '' ;
  globalLock:Boolean = false;
  userSettings:Object;
  uid:string;
  updatingSettings:Boolean = false;

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
          console.log("User has custom settings");
          console.log(res)
          this.userSettings = res[0];
          this.updatingSettings = true;

          for(let i = 0;i < this.currencies.length;i++){
            if (this.currencies[i].value == this.userSettings['currency']){
              this.activateClass(this.userSettings['currency'], this.currencies[i]);
            }
          }
          this.globalLock = this.userSettings['globalLock'];

        }else {
          this.updatingSettings = false;
          console.log("User does not have custom settings");     
          this.userSettings = {uid:uid, currency:'', globalLock:Boolean}
        }
      });
  }

  activateClass(currency, currencyButton){
    console.log(currencyButton);
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


    if(this.updatingSettings){
      this.settingsService.updateSettings(this.userSettings['id'], this.userSettings)
        .then(res => {
          this.snackBar.open('Settings Saved', undefined, {
            duration: 5000,
            panelClass: ['success', 'app-alert'],
            verticalPosition: 'top'
          });
        });
       
      }else if(!this.updatingSettings){
      this.settingsService.saveSettings(this.userSettings)
        .then(res => {
          this.snackBar.open('Settings Saved', undefined, {
            duration: 5000,
            panelClass: ['success', 'app-alert'],
            verticalPosition: 'top'
          });
        });
    }



    console.log(this.userSettings);
    console.log(this.globalCurrency, this.globalLock);
  }

}
