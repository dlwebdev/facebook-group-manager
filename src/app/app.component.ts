import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Router } from '@angular/router';

import { NotificationService } from "./services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Bill Management System';
  userLoggedIn = false;
  hasNotifications = false;
  errorMessage = "";
  notifications = [];
  allRead = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.checkIfLoggedIn();
  }

  OnNotifyAllRead(allRead: boolean) {
    console.log("onAllRead FIRED! allRead: ", allRead);

    this.hasNotifications = false;

    // if all notifications are not read, then this.hasNotifications = true;
    if(!allRead) this.hasNotifications = true;
  }

  // ngAfterViewInit is fired after the page has completely loaded. It's a built
  // in Angular2 function similar to jQuery document.ready
  ngAfterViewInit() {
    /* Fix for closing hamburger menu on click */

    console.log("ngAfterViewInit here... check on my stack overflow answer to make sure it's still correct.");

    /*
    let navbarLinks = document.getElementsByClassName("close-hamburger-on-click");

    let closeHamburgerMenu = function() {
      document.querySelector('.navbar-toggle').setAttribute('aria-expanded', 'false');
      document.querySelector('.navbar-toggle').classList.add('collapsed');
      document.querySelector('.navbar-collapse').setAttribute('aria-expanded', 'false');
      document.querySelector('.navbar-collapse').classList.add('collapse');
      document.querySelector('.navbar-collapse').classList.remove('in');
    };

    for (let i = 0; i < navbarLinks.length; i++) {
      navbarLinks[i].addEventListener('click', closeHamburgerMenu, false);
    }
    */
  }

  checkIfLoggedIn() {

    this.authService.facebookApiLogin()
      .subscribe(
        resp => {
          console.log('App component Authentication response: ', resp);
          this.router.navigate(['/']);
        },
        error =>  this.errorMessage = <any>error
      );

  }

}
