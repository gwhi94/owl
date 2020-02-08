import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component'
import { NewPlanModalComponent } from '../modals/new-plan-modal/new-plan-modal.component'
import { FocusPlanModalComponent } from '../modals/focus-plan-modal/focus-plan-modal.component';
import { PlanService } from '../services/plan-service'
import { Plan } from '../models/plan';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})


export class ControlPanelComponent implements OnInit {

  plans = [];

  constructor(public dialog: MatDialog, private planService:PlanService) { }

  ngOnInit() {
    this.getPlans();
     
  }

  getPlans(): void {
    //this would need limiting for performance
    this.planService.getPlans()
      .subscribe(plans => this.plans = plans);
            
  }

  getPlan(id) :void {
    this.planService.getPlan(id)
      .subscribe(plan => this.openFocusPlanDialog(plan))
      //need to figure out how to do more than one thing here. 
        

  }

  public focusPlan(id){
    //at this point do a getById req based on the ID and then pass that data into opening the modal. 
    console.log("opening plan", id);
    this.getPlan(id);
    
  }

  public deletePlan(plan: Plan){
    console.log("deleting plan");

    this.plans = this.plans.filter(p => p !== plan);
    this.planService.deletePlan(plan)
      .subscribe
  }


  private openFocusPlanDialog(inFocusPlan): void {
    let dialogRef = this.dialog.open(FocusPlanModalComponent,{
      data:{inFocusPlan}

    });
  }


   private openConfirmDialog(): void {
      let dialogRef = this.dialog.open(ConfirmModalComponent,{
        data:{
          message: 'End your current plan and start a new one ?',
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        },
      });

      dialogRef.afterClosed().subscribe((confirmed:boolean) =>{
        if(confirmed){
          console.log("confirmed");
          this.openNewPlanDialog();
        }else{
          console.log("not confirmed");
        }
      })
    }

    private openNewPlanDialog(): void {
      let dialogRef = this.dialog.open(NewPlanModalComponent,{
        
      });

      dialogRef.afterClosed().subscribe(result =>{
        this.plans.push(result);
        //this would then trigger a single get request on this ID to update the ngFor array. 

       
      })
    }

    test(){
      console.log(this.plans);

    }







    public newPlan(){
      console.log("new plan");

    }

}


  //  UI/LOGIC FLOW

  //User sets range first
  //User selects checkbox to exclude weekends
  //at this point we have num of days, num of weekends
  //if excluding weekends minus weekend count from days
  //=> unlock the other fields
  //run crunchNumbers on field changes update view

//adding new plan ui flow

//on complete new, only add panel should show
//user clicks add new
//new plan form should show as modal
//on save
//plan is saved to local storage for now
//on html, ngFor loops through and displays plans as cards (need guid here!)



