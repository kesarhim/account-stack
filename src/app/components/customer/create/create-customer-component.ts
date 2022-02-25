import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpService } from './../../core/services/http.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/components/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer-service';
import { Customer } from './models/customer-model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-customer-component',
  templateUrl: './create-customer-component.html',
  styleUrls: ['./create-customer-component.css']
})

export class CreateCustomerComponent implements OnInit {
  public createCustomerForm: FormGroup;
  public saveBtnLabel: string = 'Save';
  private customerId: number;
  private selectedCustomer: Customer;
  constructor(private alertService: AlertService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder, private httpService: HttpService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private _location:Location,
    private router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((value) => {
      this.customerId = value['customerId'];
    });

    this.createForm();
    if (this.customerId > 0) {
      this.saveBtnLabel = 'Update';
      this.loaderService.show();
      this.customerService.getCustomerDetailsById(this.customerId).subscribe((data: any) => {
        if (data) {
          this.patchData(data.response);
        }
        this.loaderService.hide();
      },err => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      })
    }
  }

  onAddNewClient = () => {
    this.loaderService.show();
    let payLoad = this.createCustomerForm.value;
    if(this.customerId > 0){
      payLoad.id = this.customerId;
    }
    this.httpService.post('/Customer/Create', this.createCustomerForm.value).subscribe(result => {
      this.loaderService.hide();
      let messageToShow :string = this.customerId > 0  ? 'Updated Successfully.' : 'New Client Added Successfully.';
      this.alertService.success(messageToShow);
      this.createCustomerForm.reset(true);
      this.goToCandidateListPage();
    }, err => {
      this.alertService.error(err?.error?.message);
      this.loaderService.hide();
    } );

  }

  createForm = () => {
    this.createCustomerForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      middleName: [null],
      lastName: [null, Validators.required],
      fatherName: [null, Validators.required],
      dob: [new Date(), Validators.required],
      panNo: [null, Validators.required],
      aadhaarNo: [null, Validators.required],
      mobileNo: [null, [Validators.required]],
      email: [null, [Validators.email]],
      street: [null],
      city: [null],
      state: [null],
      pincode: [null]
    });
  }

  patchData = (customer: Customer): void => {
    this.createCustomerForm.patchValue(customer)
  }

  formatAddhaarNumber = () => {

  }

  backClicked() {
    this._location.back();
  }

  goToCandidateListPage =() => {
    this.router.navigateByUrl('/home/customer/all')
  }

}
