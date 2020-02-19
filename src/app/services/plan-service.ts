import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 

import { Plan } from '../models/plan';


@Injectable({ providedIn: 'root' })
export class PlanService {

    plan$:Observable<Plan[]>;
    active$:BehaviorSubject<Boolean>;
    
    
    constructor(private http: HttpClient, private db:AngularFirestore) { }

    newPlan(formData,formValue){
        return this.db.collection('plans').add({
            name:formValue.name,
            moneyIn:formValue.moneyIn,
            expenses:formValue.expenses,
            saving:formValue.saving,
            dateRange:formData.dateRange,
            totalLeft:formData.totalLeft,
            weeklyLeft:formData.weeklyLeft,
            dailyleft:formData.dailyLeft,
            days:formData.days,
            currentSpent:formData.currentSpent,
            currentLeft:formData.currentLeft,
            
            lastUpdated:formData.lastUpdated,
            surplus:0,
            variableDailyLeft:formData.variableDailyLeft,
            variableWeeklyLeft:formData.variableWeeklyLeft,
            weekUpdated:'null',
            excludeWeekends:formData.excludeWeekends,
            
            activePlan:true  
        })
    };

    getPlans(){           
        return this.db.collection('plans').snapshotChanges();            
    };

    getPlan(plan){
        return this.db.collection('plans').doc(plan.payload.doc.id).valueChanges();
    }

    getActivePlan(){  
        console.log("called e");
        this.active$ = new BehaviorSubject(true);
        return this.plan$ = this.active$.pipe(
            switchMap(active => 
                this.db
                .collection<Plan>('plans', ref => ref.where
                ('activePlan', '==' ,active))                  
                .valueChanges({idField:'id'})
            ),
        );

    }

    updatePlan(id, plan){
        console.log("called");
        console.log(id, plan);
        return this.db.collection('plans').doc(id).set(plan);


    }
    
    deletePlan(plan){
        return this.db.collection('plans').doc(plan.payload.doc.id).delete();
    }

}