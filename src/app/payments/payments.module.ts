import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsComponent } from '../payments/payments.component';
import { PaymentsService } from '../services/payments-service';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SatDatepickerModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from 'saturn-datepicker';
import { SatNativeDateModule  } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { ChartsModule } from 'ng2-charts';


import { PipesModule } from '../pipes/pipes.module';

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
    PaymentsComponent
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
    ChartsModule,
    PipesModule.forRoot()
  ],
  providers:[
    PaymentsService
  ]
})
export class PaymentsModule { }
