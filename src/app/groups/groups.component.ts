import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: any = [];
  isLoading = false;

  constructor( private router: Router, private groupService: GroupService ) { }

  ngOnInit() {
    this.isLoading = true;

    // Retrieve posts from the API
    const gid = '360852310642785';

    // this.groupService.getGroupMembers(gid).subscribe(groups => {
    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups;

      console.log('Groups', groups);
      /*
      this.paymentService.getPaymentsForCurrentMonth().subscribe(payments => {
        this.billsUnpaid = this.billTools.getUnpaidBillsForMonth(this.bills, payments);
        if(this.billsUnpaid.length) {
          this.hasUpcomingBills = true;
        }

        this.isLoading = false;
      });
      */
    });

  }

}
