import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 


@Injectable({ providedIn: 'root' })
export class PlanService {
    
    
    constructor(private http: HttpClient, private db:AngularFirestore) { }

    newPlan(formData,formValue){
        return this.db.collection('plans').add({
            name:formValue.name,
            moneyIn:formValue.moneyIn,
            expenses:formValue.expenses,
            saving:formValue.saving,
            dateRange:formValue.dateRange,
            totalLeft:formData.totalLeft,
            weeklyLeft:formData.weeklyLeft,
            dailyleft:formData.dailyLeft,
            days:formData.days,
            weekendCount:formData.weekendCount           
        })
    };

    getPlans(){

        /* this.plansCall = this.db.collection('plans');
        this.plans = this.plansCall.valueChanges();
        
       this.plans.snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Plan;
                    const id = a.payload.doc.id;
                    return {id, data}
                })
            }) */
            
            return this.db.collection('plans').snapshotChanges();
            
    };


}