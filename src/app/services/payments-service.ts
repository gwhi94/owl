import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 
import * as moment from 'moment';
import { Payment } from '../models/payment';
import { AuthService } from '../services/auth.service';


@Injectable({ providedIn: 'root' })
export class PaymentsService {

    plan$:Observable<Payment[]>;
   
    constructor(private auth:AuthService, private http: HttpClient, private db:AngularFirestore) { }

    newPayment(formValue){
        return this.db.collection('payments').add({
            name:formValue.name,
            amount:formValue.amount,
            due:formValue.due,
            uid:formValue.uid
            
        })
    };

    getPayments(uid){         
        return this.db.collection('payments', (ref) => ref.where('uid', '==', uid) ).snapshotChanges();   
           
    };

/*     getPayment(plan){
        return this.db.collection('payments').doc(plan.payload.doc.id).valueChanges();
    }
    updatePayment(id, plan){
        return this.db.collection('payments').doc(id).set(plan);
        //need to be careful with this one as it will edit the expenses value, need #
        //to make sure we dont pull from the updated one when a plan is in progress
    }  */   
    deletePayment(payment){
        return this.db.collection('payments').doc(payment.payload.doc.id).delete();
    }

}