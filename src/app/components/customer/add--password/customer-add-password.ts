import { LoaderService } from './../../core/components/loader/loader.service';
import { HttpService } from './../../core/services/http.service';
import { Customer } from './../create/models/customer-model';
import { AlertService } from './../../core/components/alert/alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-add-password',
  templateUrl: './customer-add-password.html',
  styleUrls: ['./customer-add-password.css']

})

export class CustomerAddPasswordComponent implements OnInit {
  public addPasswordForm: FormGroup;
  public selectedCustomer: Customer | null;
  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private httpService: HttpService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.createForm();
  }

  onSelectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.patchCustomer();
  }

  createForm = () => {
    this.addPasswordForm = this.formBuilder.group({
      fullName: [null],
      aadhaarNumber: [null],
      panNumber: [null],
      incomeTaxUserId: [null],
      incomeTaxPassword: [null],
      gstUserId: [null],
      gstPassword: [null],
    });
  }

  patchCustomer = () => {
    if (this.selectedCustomer) {
      this.addPasswordForm.patchValue({
        fullName: this.selectedCustomer.fullName,
        aadhaarNumber: this.selectedCustomer.aadhaarNo,
        panNumber: this.selectedCustomer.panNo,
      });
    }
  }

  patchData = (customer: Customer) => {
    if (this.selectedCustomer) {
      this.addPasswordForm.patchValue({
        gstPassword: customer.gstPassword,
        gstUserId: customer.gstId,
        incomeTaxPassword: customer.incomeTaxPassword,
        incomeTaxUserId: customer.incomeTaxId
      });
    }
  }

  saveCustomerCredentials = () => {
    if (this.addPasswordForm.valid && this.selectedCustomer) {
      this.selectedCustomer!.gstId = this.addPasswordForm.get('gstUserId')?.value;
      this.selectedCustomer!.gstPassword = this.addPasswordForm.get('gstPassword')?.value;
      this.selectedCustomer!.incomeTaxId = this.addPasswordForm.get('incomeTaxUserId')?.value;
      this.selectedCustomer!.incomeTaxPassword = this.addPasswordForm.get('incomeTaxPassword')?.value;
      this.httpService.post('/Customer/Credential', this.selectedCustomer).subscribe(success => {
        this.loaderService.hide();
        this.addPasswordForm.reset();
        this.alertService.success('Credentials Saved Sucessfully');
      }, err => {
        this.alertService.alert(err?.error?.message);
        this.loaderService.hide();
      });
    } else {
      this.alertService.error('Please enter all mandatory details.')
    }

  }
}
