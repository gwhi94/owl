import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlansComponent } from './plans/plans.component';
import { HomeComponent } from './home/home.component';
import { SatDatepickerModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from 'saturn-datepicker';
import { SatNativeDateModule  } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartsModule } from 'ng2-charts';
import { PlanService } from './services/plan-service';
import { PaymentsService } from './services/payments-service';




import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatDatepickerModule,
  MatCardModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatListModule,
  MatSnackBar,
  MatSnackBarModule,
  MatCheckbox
} from '@angular/material';

//modals
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { NewPlanModalComponent } from './modals/new-plan-modal/new-plan-modal.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { FocusPlanModalComponent } from './modals/focus-plan-modal/focus-plan-modal.component';
import { SetDateModalComponent } from './modals/set-date-modal/set-date-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCostModalComponent } from './modals/add-cost-modal/add-cost-modal.component';
import { PaymentsComponent } from './payments/payments.component';
import { NewPaymentModalComponent } from './modals/new-payment-modal/new-payment-modal.component';




export const DateFormats = {
  parse: {
      dateInput: ['DD-MM-YYYY']
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent,
    PlansComponent,
    HomeComponent,
    ConfirmModalComponent,
    NewPlanModalComponent,
    PlanDetailComponent,
    FocusPlanModalComponent,
    SetDateModalComponent,
    DashboardComponent,
    AddCostModalComponent,
    PaymentsComponent,
    NewPaymentModalComponent
     
  ],

  entryComponents: [
     ConfirmModalComponent,
     NewPlanModalComponent,
     FocusPlanModalComponent ,
     SetDateModalComponent,
     AddCostModalComponent,
     NewPaymentModalComponent
    ],
   
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    ChartsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
         
  ],


  providers: [
    PlanService,
    PaymentsService,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormats},
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
