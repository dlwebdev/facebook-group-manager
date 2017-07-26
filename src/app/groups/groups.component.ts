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
  groupMembers: any = [];
  isLoading = false;

  constructor( private router: Router, private groupService: GroupService ) { }

  ngOnInit() {
    this.isLoading = true;

    // this.groupService.getGroupMembers(gid).subscribe(groups => {
    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups.data;

      console.log('Groups', this.groups);

      this.isLoading = false;
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

  loadGroup(group: any) {
    console.log('Loading Group: ', group);

    // this.groupService.getGroupMembers(gid).subscribe(groups => {
    this.groupService.getGroupMembers(group.id).subscribe(members => {
      // this.groups = groups.data;

      console.log('Members', members);
      this.groupMembers = members;
    });
    // make api call via service to retrieve what?
  }

}
