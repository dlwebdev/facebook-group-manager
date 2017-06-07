import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Output() notifyAllRead = new EventEmitter<boolean>();

  notifications = [];
  errorMessage = "";
  hasUnreadNotifications = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;

      let currentDate = new Date();

      // create a copy of this bill to push onto unpaid bills array
      let newNotification = notifications;

      // create a custom date field using the current month and year from a new date object. Give it the due date as day of month
      newNotification.customDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newNotification.datedue);
    });
  }

  getCountOfUnread() {
    return 0;
  }

  checkForUnreadNotification() {
    // return true if any notification has not been read
    // loop through this.notifications and check if any are unread
    for (let n of this.notifications) {
      console.log("Checking if this notification is read: ", n);
      if(!n.read) return true;
    }

    // Does not have unread notifications
    return false;
  }

  markAsRead(index_of_notification) {
    // send update to backend that sets as read to be true
    let notificationClicked = this.notifications[index_of_notification];
    // need index passed in too

    this.notificationService.markAsRead(notificationClicked._id)
      .subscribe(
        notification => {
          notificationClicked.read = true;

          // update hasNotifications on app component to be false;
          let hasUnread = this.checkForUnreadNotification();

          if(!hasUnread) {
            console.log("Set hasNotifications = false on AppComponent. FIRING EMMITER");
            this.notifyAllRead.emit(true);
          }
        },
        error =>  this.errorMessage = <any>error
      );
  }

}
