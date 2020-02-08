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
        return this.db.collection('plans').snapshotChanges();            
    };

    getPlan(plan){
        return this.db.collection('plans').doc(plan.payload.doc.id).valueChanges();
    }


}