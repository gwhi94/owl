import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSuffix } from '../pipes/date-suffix.pipe';



@NgModule({
  declarations: [
    DateSuffix
  ],
  imports: [
    CommonModule
  ],
  exports:[
    DateSuffix
  ]
})
export class PipesModule { 
  static forRoot() {
    return {
        ngModule: PipesModule,
        providers: [],
    };
 }
}
