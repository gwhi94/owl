import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private db:AngularFirestore) { }

  getSettings(uid){
    return this.db.collection('settings', (ref) => ref.where('uid', '==', uid)).valueChanges({idField:'id'}); 
  }

  saveSettings(settings){
    return this.db.collection('settings').add(settings);

  }

  updateSettings(id, settings){
    console.log(id, settings);
    //return this.db.collection('settings').doc(uid).set(plan);
    return this.db.collection('settings').doc(id).set(settings);

  }


}
