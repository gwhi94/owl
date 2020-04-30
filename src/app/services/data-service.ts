//For transfer of discrete/meta data, component to component
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

    private mostSpentSource = new BehaviorSubject<String>('');
    private spentTodaySource = new BehaviorSubject<Number>(0);
    private spentThisWeekSource = new BehaviorSubject<Number>(0);
    private percentageSpentSource = new BehaviorSubject<Number>(0);

    private uidSource = new BehaviorSubject<String>('£');

    currentMostSpent = this.mostSpentSource.asObservable();
    currentSpentToday = this.spentTodaySource.asObservable();
    currentSpentThisWeek = this.spentThisWeekSource.asObservable();
    currentPercentageSpent = this.percentageSpentSource.asObservable();

    uid = this.uidSource.asObservable();

    constructor() { }

    changeMostSpent(mostSpent: String){
        this.mostSpentSource.next(mostSpent)
    }

    changeSpentToday(spentToday: Number){
        this.spentTodaySource.next(spentToday)
    }

    changeSpentThisWeek(spentThisWeek: Number){
        this.spentThisWeekSource.next(spentThisWeek)
    }

    changePercentageSpent(percentageSpent:Number){
        this.percentageSpentSource.next(percentageSpent);
    }

    changeUid(uid:String){
        this.uidSource.next(uid);
    }

    
}