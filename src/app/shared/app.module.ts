import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ModalsModule } from '../modals/modals.module';
import { PaymentsModule } from '../payments/payments.module';
import { PlansModule } from '../plans/plans.module';
import { SharedModule } from '../shared/shared.module';
//import { PipesModule } from '../pipes/pipes.module';
import { MatSidenavModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,

  
  ],

  entryComponents: [
    
  ],
   
  imports: [
    SharedModule,
    PlansModule,
    PaymentsModule,
    DashboardModule,
    ModalsModule,
    //PipesModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
         
  ],


  providers: [
 
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
