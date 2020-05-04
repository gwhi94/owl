import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component'
import { NewPlanModalComponent } from '../modals/new-plan-modal/new-plan-modal.component'
import { SetDateModalComponent } from '../modals/set-date-modal/set-date-modal.component'
import { FocusPlanModalComponent } from '../modals/focus-plan-modal/focus-plan-modal.component';
import { PlanService } from '../services/plan-service'
import { Plan } from '../models/plan';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  animations : [

    trigger('listAnimation', [

      transition('* => *', [

        query(':enter', style({opacity:0}), {optional:true}),
       
        query(':enter', stagger('200ms', [
          animate('1s ease-in', keyframes([
            style({opacity:0, transform:'translateY(-75px)', offset:0}),
            style({opacity:0.5, transform:'translateY(35px)', offset:0.3}),
            style({opacity:1, transform:'translateY(0)', offset:1}),
          ]))
        ]), {optional:true})
      ])
    ])
  ]
})


export class PlansComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  plans: Array<any>;
  plan: {};
  activePlans:Array<any>;
  uid:string;

  constructor(private auth:AuthService, private router:Router, public dialog: MatDialog, private planService:PlanService) { }

  ngOnInit() {
    this.auth.user$.subscribe(res => {
      this.getPlans(res.uid);
      this.uid = res.uid;

    }
      
      );
   
      
  }

  ngOnDestroy(){
    
  }

  getPlans(uid){
    this.planService.getPlans(uid)
      .subscribe(res =>{
        this.plans = res;
        this.findActive()
      })
     
  }

  public navigateToDashboard(){
    this.router.navigate([''])
  }

  public findActive(){
    //TODO filter out active plan and put it in its own section on view

    this.activePlans = this.plans.filter(function(value, index, arr){
      return value.payload.doc.data().activePlan == true;
    });

    this.plans = this.plans.filter(function(value, index, arr){
      return value.payload.doc.data().activePlan == false;
    })


  }

  getPlan(plan){
    this.planService.getPlan(plan, this.uid)
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
   
  public openFocusPlanDialog(inFocusPlan): void {
    //Dies here as this modal needs styling
    let dialogRef = this.dialog.open(FocusPlanModalComponent,{
      data:{inFocusPlan}

    });
  }

   public openConfirmDialog(): void {
    if(this.activePlans.length == 0){
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
          this.openSetDateModal();        
        }
      })     
      }    
    }

    public openSetDateModal(): void {
      let dialogRef = this.dialog.open(SetDateModalComponent, {
        disableClose: true
      });

     dialogRef.afterClosed().subscribe(result=> {
       if(result) 
       this.openNewPlanDialog({weekendCount:result.weekendCount, days:result.days, dateRange:result.dateRange, excludeWeekends:result.excludeWeekends, expenses:result.expenses})      
     });
    }

    public openNewPlanDialog(dataPassedFromSet): void {
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

}




