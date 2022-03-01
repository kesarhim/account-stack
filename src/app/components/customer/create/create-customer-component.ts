import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpService } from './../../core/services/http.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/components/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer-service';
import { Customer } from './models/customer-model';
import { Location } from '@angular/common';
import { ValidateAadhaarNo, ValidatePanNo } from '../../validators/custom-validators';

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
    private _location: Location,
    private router: Router) { }

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
      }, err => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      })
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createCustomerForm.get('email')?.valueChanges.subscribe(value => {
      if(value){
        this.createCustomerForm.get('email')?.setValidators([Validators.email]);
      }else{
        this.createCustomerForm.get('email')?.removeValidators([Validators.email]);
      }
    });
  }

  onAddNewClient = () => {
    if(this.createCustomerForm.valid){
      this.loaderService.show();
      let payLoad = this.createCustomerForm.value;
      if (this.customerId > 0) {
        payLoad.id = this.customerId;
      }
      this.httpService.post('/Customer/Create', this.createCustomerForm.value).subscribe(result => {
        this.loaderService.hide();
        let messageToShow: string = this.customerId > 0 ? 'Updated Successfully.' : 'New Client Added Successfully.';
        this.alertService.success(messageToShow);
        this.createCustomerForm.reset(true);
        this.goToCandidateListPage();
      }, err => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      });

    }else {
      this.alertService.error("Please enter all the mandatory details");
    }
  }

  createForm = () => {
    this.createCustomerForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      middleName: [null],
      lastName: [null, Validators.required],
      fatherName: [null, Validators.required],
      dob: [new Date(), Validators.required],
      panNo: [null, [Validators.required, ValidatePanNo()]],
      aadhaarNo: [null],
      mobileNo: [null, Validators.required],
      email: [null],
      street: [null],
      city: [null],
      state: [null],
      pincode: [null]
    });
  }

  get panNumber() {
    return this.createCustomerForm.get('panNo');
  }

  get aaDhharNumber() {
    return this.createCustomerForm.get('aadhaarNo');
  }

  patchData = (customer: Customer): void => {
    this.createCustomerForm.patchValue(customer)
  }

  formatAddhaarNumber = () => {
    let aadhaarNumber: string = this.createCustomerForm.get('aadhaarNo')?.value;
    if (aadhaarNumber && aadhaarNumber.length === 12) {
      let value = aadhaarNumber.substring(0, 4) + '-' + aadhaarNumber.substring(4, 8) + '-' + aadhaarNumber.substring(8, 12);
      if (ValidateAadhaarNo(value)) {
        this.createCustomerForm.patchValue({
          aadhaarNo: value
        });
      }
    } else {
      this.aaDhharNumber?.setErrors({ invalidAadhaarNo: true })
    }
  }

  backClicked() {
    this._location.back();
  }

  goToCandidateListPage = () => {
    this.router.navigateByUrl('/home/customer/all')
  }

}
