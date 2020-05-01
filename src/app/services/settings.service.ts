import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private db:AngularFirestore) { }

  getSettings(uid){
    return this.db.collection('settings', (ref) => ref.where('uid', '==', uid)).snapshotChanges(); 
  }



}
