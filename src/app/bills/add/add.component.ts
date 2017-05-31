import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Bill } from '../bill';

import { BillService } from "../../services/bill.service";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  bill: Bill;
  errorMessage: String;

  constructor(private router: Router, private billService: BillService) { }

  ngOnInit() {
    this.bill = new Bill;
  }

  paymentDueDateChanged() {
    console.log("Due date changed. Do validation.");

    this.errorMessage = "";

    if(this.bill.datedue < 1 || this.bill.datedue > 31) {
      this.errorMessage = "Date due is not a valid day of month.";
    }
  }

  saveBill(): void {
    console.log("Saving this bill");

    this.billService.saveBill(this.bill)
      .subscribe(
        resp => {
          this.router.navigate(['/bills/manage']);
        },
        error =>  this.errorMessage = <any>error
      );
  }

}
