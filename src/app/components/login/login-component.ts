import { DrawerService } from './../shared/drawer/drawer.service';
import { AlertService } from './../core/components/alert/alert.service';
import { HttpService } from './../core/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.html',
  styleUrls:['./login-component.css']
})

export class LoginComponent implements OnInit {
  public loginForm:FormGroup;
  public showPassword : boolean = false;
  public passwordInputType  = 'password';
  constructor(private router: Router,
    private formBuilder: FormBuilder,private httpService : HttpService,
    private userService: UserService,
    private drawerService : DrawerService) {
      localStorage.clear();
    }

  ngOnInit() {
    localStorage.clear();
    this.createForm();
    this.drawerService.closeDrawer();
    this.logout();
  }

  createForm = () => {
    this.loginForm = this.formBuilder.group({
      username:[null,Validators.required],
      password:[null,Validators.required],
      rememberMe:[false]
    });
  }

  onPressEnter = () => {

  }

  logout = () => {
    localStorage.clear();
    this.userService.logoutUser();
  }

  onlogin =() => {
    if(this.loginForm.valid){
      let payload = {
        username: this.loginForm.get('username')?.value,
        password:this.loginForm.get('password')?.value
      }
      this.userService.login(payload.username,payload.password)
    }
  }

}
