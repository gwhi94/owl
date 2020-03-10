import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateSuffix } from '../pipes/date-suffix.pipe';



@NgModule({
  declarations: [
    DateSuffix,
    
  ],
  imports: [
    CommonModule,
  ],
 
})
export class SharedModule { }
