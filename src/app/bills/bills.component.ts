import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BillService } from "../services/bill.service";
import { PaymentService } from "../services/payment.service";

//import { BillSidebarComponent } from "../bill-sidebar/bill-sidebar.component";
import { BillTools } from './bill-tools';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  bills: any = [];
  billsUnpaid = [];
  isLoading = false;
  billTools = new BillTools();

  hasUpcomingBills = false;

  constructor(
    private router: Router,
    private billService: BillService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    // Retrieve posts from the API
    this.billService.getAllBills().subscribe(bills => {
      this.bills = bills;


      this.paymentService.getPaymentsForCurrentMonth().subscribe(payments => {
        this.billsUnpaid = this.billTools.getUnpaidBillsForMonth(this.bills, payments);
        if(this.billsUnpaid.length) {
          this.hasUpcomingBills = true;
        }

        this.isLoading = false;
      });
    });

  }

  editBill(id:string) {
    //console.log("Navigating to edit bill route and passing id of: ", id);
    this.router.navigate(['/bills/edit/' + id]);
  }

  payBill(id:string) {
    this.router.navigate(['/bills/pay/make-payment/' + id]);
  }

}
