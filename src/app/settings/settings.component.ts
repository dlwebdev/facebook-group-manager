import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  daysBeforeNotice = 0;
  errorMessage = "";

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getSetttings();
  }

  getSetttings() {
    this.userService.getSettings().subscribe(daysBefore => {
      this.daysBeforeNotice = daysBefore;
    });
  }

  saveSetting() {
    this.userService.updateSettings(this.daysBeforeNotice)
      .subscribe(
        resp => {
          this.router.navigate(['/bills/']);
        },
        error =>  this.errorMessage = <any>error
      );
  }

}
