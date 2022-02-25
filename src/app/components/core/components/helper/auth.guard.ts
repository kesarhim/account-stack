import { UserService } from './../../services/user.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private userService :UserService ,private router: Router){

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const loggedInUser = this.userService.userValue;
         if(loggedInUser && loggedInUser.username){
             return true;
         }
         this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
         return false;

    }

}
