import { UserAccount } from './../../user/user-type-model';
import { AlertService } from './../components/alert/alert.service';
import { LoaderService } from './../components/loader/loader.service';
import { StorageKeys, StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User, UserCred } from '../../shared/models/user-cred.model';


@Injectable({ providedIn: 'root' })
export class UserService {
    public userSubject: BehaviorSubject<User | null>;
    private baseURL :string = environment.API_ENDPOINT;
    constructor(
        private router: Router,
        private http: HttpClient,
        private alertService:AlertService,
        private loader: LoaderService,
        private storageService: StorageService
    ) {
      this.userSubject = new BehaviorSubject<User | null>(this.storageService.get(StorageKeys.CURRENT_USER) || null);
    }


    login(username:string, password:string) {
        this.loader.show();
        return this.http.post<UserCred>(`${this.baseURL}/Authenticate/login`, { username, password })
            .pipe(map(user => {
                localStorage.setItem(StorageKeys.TOKEN,JSON.stringify({token : user.token}))
                localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user.user));
                this.userSubject.next(user.user);
                return user;
            })).subscribe((value) => {
              this.loader.hide();
              this.router.navigateByUrl("/home/dashboard")
            },err => {
              this.alertService.error('Username Or Password does not exists. Please check the credentials.')
              this.loader.hide();
              this.userSubject.next(null);
            })
    }

    public get userValue(): User | null {
        return this.userSubject.value;
    }

    public logoutUser =() =>{
      this.loader.show();
      this.http.post(`${this.baseURL}/Authenticate/logout`,null).subscribe(success => {
        localStorage.clear();
        this.userSubject.next(null);
        this.router.navigateByUrl('/login')
      },err => {this.loader.hide()},() => {this.loader.hide()});
    }

    registerNewAccount(user:UserAccount) {
      let url = user.admin ? `${this.baseURL}/Authenticate/register-admin`: `${this.baseURL}/Authenticate/register`;
      return this.http.post(url,user)
    }
}
