import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BillService } from "../../services/bill.service";

import { Bill } from '../bill';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  bill: Bill;
  currentBillId: String;
  sub: Object;
  errorMessage: String;

  constructor(
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bill = new Bill();
  }

  ngOnInit() {
    this.getBillDetails();
  }

  getBillDetails() {
    this.sub = this.route.params.subscribe(params => {

      console.log("Checking params: ", params);

      if (params['id'] !== undefined) {
        let billId = params['id'];
        this.currentBillId = billId;

        this.billService.getBill(billId)
          .subscribe(
            bill => {
              console.log("I was returned this bill from the backend: ", bill);
              this.bill = bill;
            },
            error =>  this.errorMessage = <any>error
          );

      }
    });
  }


  updateBill(): void {
    this.billService.updateBill(this.bill)
      .subscribe(
        resp => {
          this.router.navigate(['/bills/manage']);
        },
        error =>  this.errorMessage = <any>error
      );

  }


  deleteBill(): void {
    this.billService.deleteBill(this.bill._id)
      .subscribe(
        resp => {
          this.router.navigate(['/bills/manage']);
        },
        error =>  this.errorMessage = <any>error
      );

  }

}
