import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Plan } from '../models/plan';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const plans = [
      {
        id:1,       
        name:'My Plan',
        moneyIn:1576,
        expenses:389.00,
        saving:1050,
        totalLeft:137,
        weeklyLeft:34.25,
        dailyLeft:4.56,
        dateRange:{begine:'1/1/20', end:'30/1/20'},
        days:7,
        weekendCount:0,
        active:true
        
     },
     {
      id:345,
      name:'test2',
      moneyIn:1000,
      expenses:300,
      saving:100,
      totalLeft:600,
      weeklyLeft:600,
      dailyLeft:85.71,
      dateRange:{dateRange:'test'},
      days:7,
      weekendCount:0,
      active:false
      
   }
    ];
    return {plans};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(plans: Plan[]): number {
    return plans.length > 0 ? Math.max(...plans.map(plan => plan.id)) + 1 : 11;
  }
}