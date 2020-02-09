import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component'
import { NewPlanModalComponent } from '../modals/new-plan-modal/new-plan-modal.component'
import { SetDateModalComponent } from '../modals/set-date-modal/set-date-modal.component'
import { FocusPlanModalComponent } from '../modals/focus-plan-modal/focus-plan-modal.component';
import { PlanService } from '../services/plan-service'
import { Plan } from '../models/plan';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})


export class ControlPanelComponent implements OnInit {

  plans: Array<any>;
  plan: {};

  constructor(public dialog: MatDialog, private planService:PlanService) { }

  ngOnInit() {
   this.getPlans();
      
  }

  getPlans(){
    this.planService.getPlans()
      .subscribe(res =>(this.plans = res));
  }

  getPlan(plan){
    this.planService.getPlan(plan)
      .subscribe(res => (this.openFocusPlanDialog(res)));

  }

  getActivePlan(){
    //this is fired when loading the active plan
    //pull out the active plan
    //re calculate everything

  }

  deletePlan(){
    
  }

   updatePlan(){

    //this will be called anytime the user inputs a cost
    //will need to recalculate the figures



   }


    
  private openFocusPlanDialog(inFocusPlan): void {
    //Dies here as this modal needs styling
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
          //this.openNewPlanDialog();
          this.openSetDateModal();
        }else{
          console.log("not confirmed");
        }
      })
    }

    private openSetDateModal(): void {
      let dialogRef = this.dialog.open(SetDateModalComponent, {

      });

     dialogRef.afterClosed().subscribe(result=> {
       console.log(result);

       this.openNewPlanDialog({days:result.days, dateRange:result.dateRange})
     });
  

    }

    private openNewPlanDialog(dataPassedFromSet): void {
      let dialogRef = this.dialog.open(NewPlanModalComponent,{

        data:{dataPassedFromSet}
        
      });

      dialogRef.afterClosed().subscribe(result =>{
        this.plans.push(result);
        //this would then trigger a single get request on this ID to update the ngFor array. 

       
      })
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



