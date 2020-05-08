import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private snackBar:MatSnackBar) { }


  showError(message){
    console.log(message);
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['error', 'app-alert'],
      verticalPosition: 'top'
    });
  }
}
