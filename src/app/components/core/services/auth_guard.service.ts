import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AlertService } from '../components/alert/alert.service';
import { StorageService } from './storage.service';
import { UserDataObj } from '../../shared/enums';
import { EventStreamService, EmitEvent, Events } from './event-stream.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardService implements CanActivate, CanActivateChild, CanLoad {
  _userData = UserDataObj;
  user_permission: any = [];
  constructor(
    private router: Router,
    private _alert: AlertService,
    private _storage: StorageService,
    private _eventSteam: EventStreamService,
    private storageService: StorageService
  ) {
    this.user_permission = localStorage.getItem('user_permission');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this._storage.get(this._userData[0])) {
      // this._alert.warn(
      //   'You are not allowed to view this page. You are redirected to login Page',
      //   { color: 'red', bgColor: 'lightgreen', position: 'top-right' }
      // );

      this.router.navigate(['auth/login'], { queryParams: { navigate: encodeURIComponent(state.url) } });

      return false;
    } else {
      this._eventSteam.emit(new EmitEvent(Events.LoggedIn, true));
      return true;
    }
  }
  private getRoutePermissions(route: ActivatedRouteSnapshot) {
    if (route.data && route.data.userRoles) {
      return route.data.userRoles;
    }
    return null;
  }
  public async canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedUserRoles = this.getRoutePermissions(route);
    return await this.checkPermission(allowedUserRoles);
  }

  private checkPermission(allowedUserRoles) {
    if (!allowedUserRoles) {
      return true;   // if no user roles has been set, all user are allowed to access the route
    } else {
      // return this.user_permission.getUserRoles().then((userRoles: string[]) => {
      const user = this.storageService.get('user');
      if (user?.is_superuser) {
        return true;
      }
      let user_permission = JSON.parse(localStorage.getItem('user_permission'));
      if (this.areUserRolesAllowed(user_permission, allowedUserRoles)) {
        return true;
      } else {
        this.router.navigateByUrl('/auth/unauthorized');
        return false;
      }
      // });
    }

  }
  public areUserRolesAllowed(userRoles: string[], allowedUserRoles): boolean {
    if (userRoles && userRoles.length > 0) {
      for (const role of userRoles) {
        for (const allowedRole of allowedUserRoles) {
          if (role.toLowerCase() === allowedRole.toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    } else {
      return false;
    }
  }
  public canLoad() {
    return this.checkPermission(null);
  }
}
