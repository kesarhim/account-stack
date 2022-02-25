import { UserType, UserAccount } from './user-type-model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoaderService } from './../core/components/loader/loader.service';
import { AlertService } from './../core/components/alert/alert.service';
import { UserService } from './../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-user-component',
  templateUrl: './add-user-component.html',
  styleUrls: ['./add-user-component.css']
})

export class AddUserComponent implements OnInit {
  public addUserForm: FormGroup;
  public userType: UserType;
  constructor(private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,private _location: Location ) {

  }

  get userEmail() { return this.addUserForm.get('userEmail') };

  ngOnInit() {
    this.createForm();
  }

  createForm = () => {
    this.addUserForm = this.formBuilder.group({
      username: [null, Validators.required],
      userPassword: [null, [Validators.required, Validators.minLength(5)]],
      confirmpassword: [null, [Validators.required, this.confirmPasswords]],
      userEmail: [null,{ validators: [Validators.email, Validators.required,], updateOn: "blur" }],
    });
  }

  onSave = () => {
    if (this.addUserForm.valid) {
      let payload: UserAccount = new UserAccount();
      payload.admin = this.userType === UserType.ADMIN;
      payload.userName = this.addUserForm.get('username')?.value;
      payload.password = this.addUserForm.get('userPassword')?.value;
      payload.email = this.addUserForm.get('userEmail')?.value;
      this.loaderService.show();
      this.userService.registerNewAccount(payload).subscribe(sucess => {
        this.loaderService.hide();
        this.alertService.success('New user account created successfully');
        this.addUserForm.reset(true);
      }, err => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      })
    } else {
      this.alertService.error("Please enter all mandatory fields.");
    }
  }

  onSelectUserType = (type: UserType) => {
    this.userType = type;
  }

  confirmPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = this.addUserForm?.get('userPassword')?.value;
    let confirmPass = this.addUserForm?.get('confirmpassword')?.value
    return pass === confirmPass ? null : { passwordNotMatch: true }
  }

  backClicked() {
    this._location.back();
  }


}
