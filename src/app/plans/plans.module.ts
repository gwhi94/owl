import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanService } from '../services/plan-service';
import { PlansComponent } from '../plans/plans.component';


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
  MatDialogModule,


} from '@angular/material';

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
    PlansComponent
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
  providers : [
    PlanService,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormats},
  ]

  
})
export class PlansModule { }
