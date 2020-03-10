import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCostModalComponent } from '../modals/add-cost-modal/add-cost-modal.component';
import { NewPaymentModalComponent } from '../modals/new-payment-modal/new-payment-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { NewPlanModalComponent } from '../modals/new-plan-modal/new-plan-modal.component';
import { FocusPlanModalComponent } from '../modals/focus-plan-modal/focus-plan-modal.component';
import { SetDateModalComponent } from '../modals/set-date-modal/set-date-modal.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SatDatepickerModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from 'saturn-datepicker';
import { SatNativeDateModule  } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { ChartsModule } from 'ng2-charts';

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
  MatSnackBarModule,
  MatExpansionModule,
  MatDialogModule


} from '@angular/material';



@NgModule({
  declarations: [
    AddCostModalComponent,
    NewPaymentModalComponent,
    ConfirmModalComponent,
    NewPlanModalComponent,
    FocusPlanModalComponent,
    SetDateModalComponent
    


  ],
  imports: [
    CommonModule,
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
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    ChartsModule
  ],
  entryComponents: [
    ConfirmModalComponent,
    NewPlanModalComponent,
    FocusPlanModalComponent,
    SetDateModalComponent,
    AddCostModalComponent,
    NewPaymentModalComponent
   ],
})
export class ModalsModule { }
