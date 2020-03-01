import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component'
import { NewPlanModalComponent } from '../modals/new-plan-modal/new-plan-modal.component'
import { SetDateModalComponent } from '../modals/set-date-modal/set-date-modal.component'
import { FocusPlanModalComponent } from '../modals/focus-plan-modal/focus-plan-modal.component';
import { PlanService } from '../services/plan-service'
import { Plan } from '../models/plan';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})


export class PlansComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  plans: Array<any>;
  plan: {};
  activePlan:Object;

  constructor(public dialog: MatDialog, private planService:PlanService) { }

  ngOnInit() {
   this.getPlans();
      
  }

  ngOnDestroy(){
    
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

  deletePlan(plan){
    console.log("deleting plan");
    this.planService.deletePlan(plan)
      .then(
        res => {
          console.log("deleted");
        },
        err => {
          console.log("Could not delete plan");
        }
      )
   
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
    if(this.plans.length == 0){
      this.openSetDateModal();
    }else{
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

          this.subscription = this.planService.getActivePlan()
            .subscribe(result => {
              console.log(result);
              this.activePlan = result[0];
              this.subscription.unsubscribe();
              this.deactivatePlan();          
            })      
        }
      })     
      }    
    }

    private openSetDateModal(): void {
      let dialogRef = this.dialog.open(SetDateModalComponent, {
        disableClose: true
      });

     dialogRef.afterClosed().subscribe(result=> {
       if(result) 
       this.openNewPlanDialog({days:result.days, dateRange:result.dateRange, excludeWeekends:result.excludeWeekends})      
     });
    }

    private openNewPlanDialog(dataPassedFromSet): void {
      let dialogRef = this.dialog.open(NewPlanModalComponent,{
        disableClose: true,
        data:{dataPassedFromSet}
        
      });

      dialogRef.afterClosed().subscribe(result =>{
        if(result){
          this.plans.push(result);
        }else{
          console.log("no");
        }     
      })
    }

    deactivatePlan() {
      this.activePlan['activePlan'] = false;
      this.planService.updatePlan(this.activePlan['id'], this.activePlan)
        .then(res => {
          this.openSetDateModal();
        })
      
    }

 

}




