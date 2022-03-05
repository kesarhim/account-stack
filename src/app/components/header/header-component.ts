import { Router } from '@angular/router';
import { Customer } from './../customer/create/models/customer-model';
import { UserService } from './../core/services/user.service';
import { StorageService } from './../core/services/storage.service';
import { User, UserCred } from '../shared/models/user-cred.model';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.html',
  styleUrls:['./header-component.css']
})

export class HeaderComponent implements OnInit {
  public clientName:string;
  public loggedInUser:User | null;
  public showSearchUI:boolean = false;
  constructor(private storageService: StorageService,private userService: UserService,private router:Router) { }

  ngOnInit() {
    this.clientName  = environment.projectName;
    this.userService.userSubject.subscribe((value :User | null) => {
      this.loggedInUser = value;
    });
  }

  onSelectCustomer = (customer:Customer) => {
    if(customer && customer.id >0){
      this.router.navigate(['/home/client-profile'], { queryParams: { customerId: customer.id } });
    }
  }
}
