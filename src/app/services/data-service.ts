import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

    private mostSpentSource = new BehaviorSubject<String>('dd');
    currentMostSpent = this.mostSpentSource.asObservable();

    constructor() { }

    changeMostSpent(mostSpent: String){
        this.mostSpentSource.next(mostSpent)
    }
}