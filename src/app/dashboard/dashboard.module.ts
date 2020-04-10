import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NotificationsModule } from '../notifications/notifications.module';

import { NotificationsComponent } from '../notifications/notifications.component';

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
  
} from '@angular/material';

@NgModule({
  declarations: [
    DashboardComponent,
   
    
  ],
  imports: [
    RouterModule,
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
    ChartsModule

  ]
})
export class DashboardModule { }
