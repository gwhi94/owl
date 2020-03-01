import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 
import * as moment from 'moment';
import { Plan } from '../models/plan';


@Injectable({ providedIn: 'root' })
export class PlanService {

    plan$:Observable<Plan[]>;
    active$:BehaviorSubject<Boolean>;

    today = moment(moment());
    
    
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
            weekUpdated:formData.dateRange.begin,
            excludeWeekends:formData.excludeWeekends,
            costCategories:[],
            
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
        return this.db.collection('plans', (ref) => ref.where('activePlan', '==', true)).valueChanges({idField:'id'});

    }

    updatePlan(id, plan){
        return this.db.collection('plans').doc(id).set(plan);


    }
    
    deletePlan(plan){
        return this.db.collection('plans').doc(plan.payload.doc.id).delete();
    }

}