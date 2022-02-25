import { OtherWorkDetailDTO } from './../view-other-work-list/model/other-work-details-dto';
import { OtherWorkDetail } from './../../customer/models/other-work-detail-model';
import { AlertService } from './../../core/components/alert/alert.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { OthweWorkDetailService as OtherWorkDetailService } from './../../customer/service/other-work-detail-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../../customer/create/models/customer-model';
import { User } from '../../shared/models/user-cred.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKeys, StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-add-other-work-component',
  templateUrl: './add-other-work-component.html',
  styleUrls:['./add-other-work-component.css']

})

export class AddOtherWorkComponent implements OnInit {
  @Input() searchAllowed: boolean = true;
  public addOtheWorkForm:FormGroup;
  private selectedCustomer:Customer | null;
  public othweWorkDetailId:number;
  private loggedInUser: User;
  private otheWorkDetails : OtherWorkDetailDTO | null;
  constructor(private formbuilder:FormBuilder,
    private otherWorkDetailService : OtherWorkDetailService,private loaderService:LoaderService,
    private alertService:AlertService, private router: Router, private route: ActivatedRoute,private storageService:StorageService) { }

  ngOnInit() {
    this.creatForm();
    this.loggedInUser = this.storageService.get(StorageKeys.CURRENT_USER);
    this.route.queryParams.subscribe((value) => {
      this.othweWorkDetailId = value['id'];
    });

    if(this.othweWorkDetailId > 0){
      this.searchAllowed = false;
      this.loaderService.show();
      this.otherWorkDetailService.getOtherWorkDetailsById(this.othweWorkDetailId).subscribe((result:any) => {
        this.loaderService.hide();
        this.otheWorkDetails = result?.response;
        this.patchOtherWorkDetails();

      },err => {
        this.loaderService.hide();
      })
    }
   }

   patchOtherWorkDetails = () => {
     if(this.otheWorkDetails){
       this.addOtheWorkForm.patchValue({
        firstName: this.otheWorkDetails.firstName,
        middleName: this.otheWorkDetails.middleName,
        lastName: this.otheWorkDetails.lastName,
        panNumber: this.otheWorkDetails.panNo,
        aadhaarNumber: this.otheWorkDetails.aadhaarNo,
        mobileNumber: this.otheWorkDetails.mobileNo,
        clientName: this.otheWorkDetails.clientName,
        work: this.otheWorkDetails.work,
        careOf: this.otheWorkDetails.careOf,
        fileDate: this.otheWorkDetails.fileDate,
        totalFees: this.otheWorkDetails.totalFees,
        feesPaid: this.otheWorkDetails.feesPaid,
        remark: this.otheWorkDetails.remark,
       })
     }
   }

  creatForm = () => {
    let currdate = new Date();
    this.addOtheWorkForm = this.formbuilder.group({
      firstName: [null],
      middleName: [null],
      lastName: [null],
      panNumber: [null],
      aadhaarNumber: [null],
      mobileNumber: [null],
      clientName: [null,Validators.required],
      work:[null,Validators.required],
      careOf: [null, Validators.required],
      fileDate: [currdate, Validators.required],
      totalFees: [null, Validators.required],
      feesPaid: [null],
      remark: [null],
    });

  }

  onSelectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.addOtheWorkForm?.patchValue({
      firstName: this.selectedCustomer?.firstName,
      middleName: this.selectedCustomer?.middleName,
      lastName: this.selectedCustomer?.lastName,
      panNumber: this.selectedCustomer?.panNo,
      aadhaarNumber: this.selectedCustomer?.aadhaarNo,
      mobileNumber: this.selectedCustomer?.mobileNo
    });
  }

  onSaveWorkDetails = () => {
    if (this.addOtheWorkForm.valid) {
      this.loaderService.show();
      let otherWorkDetails: OtherWorkDetail = this.addOtheWorkForm.value;
      if(this.selectedCustomer){
        otherWorkDetails.customerId = this.selectedCustomer.id;
      }

      otherWorkDetails.doneBy = this.loggedInUser?.username;
      if (this.otheWorkDetails) {
        otherWorkDetails.id = this.otheWorkDetails.id;
      }
      this.otherWorkDetailService.saveOtherWorkDetail(otherWorkDetails).subscribe((sucess: any) => {
        this.loaderService.hide();
        this.alertService.success('Work Details Saved Successfully');
        this.selectedCustomer = null;
        this.resetForm();
       this.goToviewOtherWorkList();
      }, (err: any) => {
        this.alertService.error(err?.error?.message);
        this.loaderService.hide();
      })
    } else {
      this.alertService.error('Please enter all mandatory details.');
    }
  }

  goToviewOtherWorkList =() => {
    this.router.navigateByUrl('/home/other-work-list')
  }

  resetForm = () => {
    this.addOtheWorkForm.reset(true);
    this.selectedCustomer = null;
    this.otheWorkDetails = null;
    this.othweWorkDetailId = 0;
    this.searchAllowed = true;
  }

}
