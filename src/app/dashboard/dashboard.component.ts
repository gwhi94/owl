import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  activePlan:Object;

  constructor(private planService:PlanService) { }

  ngOnInit() {
    this.planService.getActivePlan()
      .subscribe(res => this.activePlan = res[0]);
  }

  addCost(){
    console.log("adding cost");
    


  }

}
