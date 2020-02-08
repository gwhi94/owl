import { Component, OnInit, Inject } from '@angular/core';
import  {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  confirmButtonText= "Yes"
  cancelButtonText = "No"
  message = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmModalComponent>) {
    if (data) {
      this.confirmButtonText = this.confirmButtonText;
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
      if (data.message){
        this.message = data.message;
      }
    }
    this.dialogRef.updateSize('300vw','300vw')
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }




  ngOnInit() {
  }

}
