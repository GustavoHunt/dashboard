import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
// Import our authentication service
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | boolean {

      if (this.localStorageService.get('user')) {
        return true;
      }

      this.router.navigate(['/pages/login']);
    
  }

}