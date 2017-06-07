import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Bill } from '../../bill';
import { BillService } from "../../../services/bill.service";
import { PaymentService } from "../../../services/payment.service";

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {
  bill: Bill;
  isPaid: boolean;
  bills: any = [];
  currentBillId: String;
  currentParams: Object;
  errorMessage: String;

  constructor(
    private billService: BillService,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // set bill to empty bill object
    this.bill = new Bill();
    // set isPaid to false to start
    this.isPaid = false;
  }

  ngOnInit() {
    // Once page has loaded, call the getBillDetails function to retrieve this bills info from the backend
    this.getBillDetails();
  }

  // toggleStatus changes the status variable on bill model
  toggleStatus(status:string) {
    this.bill.status = status;
    if(status === "Paid") this.isPaid = true;
    else this.isPaid = false;
  }

  // getBillDetails gets the current parameter id from route and then gets that bill from backend through BillService
  getBillDetails() {
    this.route.params.subscribe(params => {

      if (params['id'] !== undefined) {
        let billId = params['id'];

        this.currentBillId = billId;

        this.billService.getBill(billId)
          .subscribe(
            bill => {
              console.log("I was returned this bill from the backend: ", bill);
              this.bill = bill;

              if(bill.status == "Paid") this.isPaid = true;
            },
            error =>  this.errorMessage = <any>error
          );

      }
    });
  }

  // save bill in backend
  saveBill() {
    console.log("Saving bill...");

    let payment = {
      'bill_id': this.bill._id,
      'bill_name': this.bill.name,
      'payment_date': ''
    };

    this.paymentService.createPayment(payment)
      .subscribe(
        resp => {
          this.router.navigate(['/bills/pay']);
        },
        error =>  this.errorMessage = <any>error
      );

  }

}
