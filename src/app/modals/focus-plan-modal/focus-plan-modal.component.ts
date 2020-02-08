import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-focus-plan-modal',
  templateUrl: './focus-plan-modal.component.html',
  styleUrls: ['./focus-plan-modal.component.scss']
})
export class FocusPlanModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }

}
