import { GSTDetailsDTO } from './../view-all-gst/model/gst-details-dto';
import { GSTDetailService } from './../customer/service/gst-details-service';
import { CustomerService } from './../customer/service/customer-service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from './../core/components/loader/loader.service';
import { AlertService } from './../core/components/alert/alert.service';
import { AlertComponent } from './../core/components/alert/alert.component';
import { HttpService } from './../core/services/http.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { GstDetails } from '../customer/models/gst-details-model';
import { Customer } from '../customer/create/models/customer-model';
import { StorageKeys, StorageService } from '../core/services/storage.service';
import { User } from '../shared/models/user-cred.model';

@Component({
  selector: 'app-customer-add-gst',
  templateUrl: './customer-add-gst-component.html',
  styleUrls: ['./customer-add-gst-component.css'],
})

export class CustomerAddGSTComponent implements OnInit {

  public addGSTForm !: FormGroup;
  public selectedCustomer: Customer | null;
  public gstDetailId: number;
  private loggedInUser: User;
  private gstDetail: GSTDetailsDTO;
  @Input() searchAllowed: boolean = true;

  constructor(private formbuilder: FormBuilder, private httpService: HttpService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private storageService: StorageService,
    private router: Router, private route: ActivatedRoute,
    private customerService: CustomerService,
    private gstDetailService: GSTDetailService) { }

  ngOnInit() {
    this.creatForm();
    this.loggedInUser = this.storageService.get(StorageKeys.CURRENT_USER);
    this.route.queryParams.subscribe((value) => {
      this.gstDetailId = value['id'];
    });
    if (this.gstDetailId > 0) {
      this.searchAllowed = false;
    }
    if (this.gstDetailId > 0) {
      this.gstDetailService.getGstDetailsById(this.gstDetailId).subscribe((result: any) => {
        if (result && result.response) {
          this.gstDetail = result.response;
          this.patchGStDetails(this.gstDetail);
          //  this.onSelectDetail(result.response);
        }
        this.customerService.getCustomerDetailsById(result.response?.customerId).subscribe((value: any) => {
          let customer: Customer = value.response;
          this.onSelectCustomer(customer);
        });
      })
    }
  }

  creatForm = () => {
    let currdate = new Date();

    this.addGSTForm = this.formbuilder.group({
      firstName: [null],
      middleName: [null],
      lastName: [null],
      panNumber: [null],
      aadhaarNumber: [null],
      mobileNumber: [null],
      gstNumber: [null],
      gstType: [null, Validators.required],
      fileDate: [currdate, Validators.required],
      year: [currdate.getFullYear().toString(), Validators.required],
      month: [currdate.getMonth().toString(), Validators.required],
      totalFees: [null, Validators.required],
      feesPaid: [null, Validators.required],
      remark: [null],

    });
  }

  patchGStDetails = (gstDetail: GSTDetailsDTO) => {
    if (gstDetail) {
      this.addGSTForm?.patchValue({
        gstNumber: gstDetail.gstNumber,
        gstType: gstDetail?.gstTypeCode.code,
        fileDate: gstDetail.fileDate,
        year: gstDetail?.yearCode?.code,
        month: gstDetail.monthCode.code,
        totalFees: gstDetail?.totalfees,
        feesPaid: gstDetail.feespaid,
        remark: gstDetail.remark
      });
    }
  }

  onSelectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.addGSTForm?.patchValue({
      firstName: this.selectedCustomer?.firstName,
      middleName: this.selectedCustomer?.middleName,
      lastName: this.selectedCustomer?.lastName,
      panNumber: this.selectedCustomer?.panNo,
      aadhaarNumber: this.selectedCustomer?.aadhaarNo,
      mobileNumber: this.selectedCustomer?.mobileNo
    });
  }

  onSaveGstDetails = () => {
    if (this.addGSTForm.valid && this.selectedCustomer!.id > 0) {
      this.loaderService.show();
      let gstDetails: GstDetails = this.addGSTForm.value;
      gstDetails.customerId = this.selectedCustomer!.id;
      gstDetails.doneBy = this.loggedInUser?.username;
      if (this.gstDetail) {
        gstDetails.id = this.gstDetail.id;
      }
      this.httpService.post('/GstDetail/Save', gstDetails).subscribe((sucess: any) => {
        this.loaderService.hide();
        this.alertService.success('GST Details Saved Successfully');
        this.selectedCustomer = null;
        this.addGSTForm.reset(true);
        this.goToviewGstList();
      }, (err: any) => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      })
    } else {
      this.alertService.error('Please enter all mandatory details.');
    }
  }

  goToviewGstList = () => {
    this.router.navigateByUrl('/home/gst-list');
  }
  onAddPayment=()=>{
    this.router.navigateByUrl('/home/receive-payment');
  }
}


