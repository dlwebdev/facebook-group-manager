import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  loggedIn: boolean;

  canActivate() {

    this.authService.getUserAuthStatus().subscribe(resp => {
      this.loggedIn = resp['authenticated'];
    });

    if (this.loggedIn) {
      return true;
    }

    //Redirect the user before denying them access to this route
    this.router.navigate(['/login']);
    return false;
  }
}
