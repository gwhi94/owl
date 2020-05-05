import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [
  
    
  ],
  imports: [
    CommonModule,
  ],
  exports : [
    
  ],
   providers: [
    AngularFireAuth,
    AngularFireAuthModule
    
   ]
 
})
export class SharedModule { }
