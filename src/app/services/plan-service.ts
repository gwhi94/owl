import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 

import { Plan } from '../models/plan';


interface Post {
    test:string
}




@Injectable({ providedIn: 'root' })
export class PlanService {
    private plansUrl = 'api/plans';
    
    constructor(private http: HttpClient) { }
        


    //postCollection: AngularFirestoreCollection<Post>;
    posts: Observable<Post[]>;


    getCollection









    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
        

    
    getPlans (): Observable<Plan[]> {
        return this.http.get<Plan[]>(this.plansUrl)
            .pipe(
                tap(_ => console.log('fetched heroes')),
                catchError(this.handleError<Plan[]>('getPlans', []))
            );
          
    }

    getPlan (id: number): Observable<Plan> {
        console.log(id);
        const url = `${this.plansUrl}/${id}`;
        return this.http.get<Plan>(url).pipe(
          tap(_ => console.log(`fetched plan id=${id}`)),
          catchError(this.handleError<Plan>(`getPlan id=${id}`))
        );
    }

    addPlan(plan: Plan): Observable<Plan> {
        return this.http.post<Plan>(this.plansUrl, plan, 
            this.httpOptions).pipe(
                tap((newPlan: Plan) => console.log('added Plan')),
                catchError(this.handleError<Plan>('addPlan'))
            );

    }

    deletePlan (plan: Plan | number): Observable<Plan> {
        const id = typeof plan === 'number' ? plan:plan.id;
        const url = `${this.plansUrl}/${id}`;

        return this.http.delete<Plan>(url, this.httpOptions).pipe(
            tap(_=> console.log('deleted plan id=${id}')),
            catchError(this.handleError<Plan>('deletePlan'))
        )
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead     
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);     
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }







   /* getActivePlan(active: boolean):Plan{
        return PLANS.find(plan => plan.active == true);
    }*/

}