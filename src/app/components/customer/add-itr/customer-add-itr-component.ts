import { ITRDetailsDTO } from './../../view-itr/model/itr-details-dto-model';
import { CustomerService } from './../service/customer-service';
import { ITRDetailService } from './../service/itr-details-service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService, StorageKeys } from './../../core/services/storage.service';
import { User } from './../../shared/models/user-cred.model';
import { LoaderService } from './../../core/components/loader/loader.service';
import { ITRDetails } from './../models/itr-deatils-model';
import { HttpService } from './../../core/services/http.service';
import { Customer } from './../create/models/customer-model';
import { AlertService } from './../../core/components/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-customer-add-itr',
  templateUrl: './customer-add-itr-component.html',
  styleUrls: ['./customer-add-itr-component.css'],
})

export class CustomerAddITRComponent implements OnInit {
  public addITRForm: FormGroup;
  public selectedCustomer: Customer | null;
  @Input() searchAllowed: boolean = true;
  @Input() showTitle: boolean = true;


  @Input() set customer(value: Customer) {
    if (value) {
      this.onSelectCustomer(value);
    }
  };

  public itrDetailId: number;
  private loggedInUser: User;
  private itrDetail: ITRDetailsDTO;
  constructor(private fromBuilder: FormBuilder, private router: Router,
    private alerService: AlertService, private httpService: HttpService,
    private loaderService: LoaderService, private storageService: StorageService,
    private itrDetailService: ITRDetailService,
    private customerService: CustomerService,
    private route: ActivatedRoute) {
    this.createForm();
  }


  ngOnInit() {
    this.route.queryParams.subscribe((value) => {
      this.itrDetailId = value['id'];
    });
    if (this.itrDetailId > 0) {
      this.searchAllowed = false;
    }
    this.loggedInUser = this.storageService.get(StorageKeys.CURRENT_USER);
    if (this.itrDetailId > 0) {
      this.itrDetailService.getITRDetailsById(this.itrDetailId).subscribe((result: any) => {
        if (result && result.response) {
          this.itrDetail = result.response;
          this.onSelectDetail(result.response);
        }
        this.customerService.getCustomerDetailsById(result.response?.customerId).subscribe((value: any) => {
          let customer: Customer = value.response;
          this.onSelectCustomer(customer);
        });
      })
    }
  }

  createForm = () => {
    this.addITRForm = this.fromBuilder.group({
      firstName: [null],
      middleName: [null],
      lastName: [null],
      panNumber: [null],
      mobileNumber: [null],
      aadhaarNumber: [null],
      ackNo: [null, Validators.required],
      fileDate: [new Date(), Validators.required],
      taxAmount: [ Validators.required],
      refundAmount: [Validators.required],
      totalFees: [Validators.required],
      feesPaid: [ ],
      yearCode: ['4', Validators.required],
      remark: [null]
    });
  }

  onSelectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.addITRForm?.patchValue({
      firstName: this.selectedCustomer?.firstName,
      middleName: this.selectedCustomer?.middleName,
      lastName: this.selectedCustomer?.lastName,
      panNumber: this.selectedCustomer?.panNo,
      aadhaarNumber: this.selectedCustomer?.aadhaarNo,
      mobileNumber: this.selectedCustomer?.mobileNo
    });
  }

  onSelectDetail = (itrDetail: ITRDetailsDTO) => {
    this.addITRForm.patchValue({
      ackNo: itrDetail.ackNo,
      yearCode: itrDetail.year.code,
      fileDate: itrDetail.fileDate,
      taxAmount: itrDetail.taxAmount,
      refundAmount: itrDetail.refundAmount,
      totalFees: itrDetail.totalFees,
      feesPaid: itrDetail.feesPaid,
      remark: itrDetail.remark
    })
  }

  onSaveITRFileDetails = () => {
    if (this.addITRForm.valid && this.selectedCustomer!.id > 0) {
      this.loaderService.show();
      let itrDetails: ITRDetails = this.addITRForm.value;
      itrDetails.customerId = this.selectedCustomer!.id;
      itrDetails.doneBy = this.loggedInUser?.username;
      if (this.itrDetail) {
        itrDetails.id = this.itrDetail.id;
      }
      this.httpService.post('/ITRDetail/Save', itrDetails).subscribe(sucess => {
        this.loaderService.hide();
        this.alerService.success('ITR Details Added Successfully');
        this.selectedCustomer = null;
        this.addITRForm.reset(true);
        // this.router.navigateByUrl('/home/viewItr');
        this.goToViewITRList();
      }, err => {
        this.alerService.error(err?.error?.message);
        this.loaderService.hide();
      })
    } else {
      this.alerService.error('Please enter all mandatory details.');
    }
  }

  goToViewITRList = () => {
    this.router.navigateByUrl('/home/viewItr');
  }

}
