import { ConfirmationDialogService } from './../shared/confim-dialog/confimation-dialog-service';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-app-home-component',
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {
  mode = new FormControl('side');
  @ViewChild('sidenav') drawer: MatSidenav;
  constructor(private router:Router,private userService: UserService,
  private confirmationDialogService : ConfirmationDialogService) { }
  showOpenIcon = false;
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.drawer.closedStart.subscribe((data) => {
      this.showOpenIcon = true;
    });
    this.drawer.openedStart.subscribe((data) => {
      this.showOpenIcon = false;
    })
  }

  hideSideNav = () => {
    this.drawer.toggle();
  }

  showSideNav = () => {
    this.drawer.toggle();

  }

  logout = () => {
    this.confirmationDialogService.showConfirmationDialog("Do you want to logout ?").subscribe((value:boolean) => {
      if(value){
        this.userService.logoutUser();
      }
    })
  }
  GoToInvoice(){
    
    this.router.navigateByUrl(`/home/create-invoice`);
  }
}
