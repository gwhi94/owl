//For transfer of discrete data, component to component
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

    private mostSpentSource = new BehaviorSubject<String>('');
    private spentTodaySource = new BehaviorSubject<Number>(0);
    private spentThisWeekSource = new BehaviorSubject<Number>(0);

    currentMostSpent = this.mostSpentSource.asObservable();
    currentSpentToday = this.spentTodaySource.asObservable();
    currentSpentThisWeek = this.spentThisWeekSource.asObservable();

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
}