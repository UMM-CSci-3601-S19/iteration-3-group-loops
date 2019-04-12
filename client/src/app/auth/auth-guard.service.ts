import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AppService} from "../app.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, public appService: AppService) {
  }

  canActivate(): boolean {
    if (!this.appService.isSignedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
