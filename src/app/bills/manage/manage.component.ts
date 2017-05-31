import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { BillService } from "../../services/bill.service";

import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  bills: any = [];
  isLoading = false;

  constructor(private router: Router, private billService: BillService) { }

  ngOnInit() {
    this.isLoading = true;
    // Retrieve posts from the API
    this.billService.getAllBills().subscribe(bills => {
      this.bills = bills;

      this.bills.sort(this.sortBills);
      this.addCustomDueDateField();
      this.isLoading = false;
    });
  }

  sortBills(a, b) {
    if (a.datedue < b.datedue)
      return -1;
    if (a.datedue > b.datedue)
      return 1;
    return 0;
  }

  addCustomDueDateField() {
    // do a map on this.billsUnpaid that adds a custom date to display for datedue
    for(let i = 0; i < this.bills.length; i++ ) {
      let currentDate = new Date();
      // create a custom date field using the current month and year from a new date object. Give it the due date as day of month
      this.bills[i].customDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), this.bills[i].datedue);
    }
  }


  editBill(id:string) {
    //console.log("Navigating to edit bill route and passing id of: ", id);
    this.router.navigate(['/bills/edit/' + id]);
  }

}
