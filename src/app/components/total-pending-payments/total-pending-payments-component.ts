import { OtherWorkDetailDTO } from './../other-work/view-other-work-list/model/other-work-details-dto';
import { Customer } from './../customer/create/models/customer-model';
import { CustomerService } from './../customer/service/customer-service';
import { LoaderService } from './../core/components/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-total-pending-payments',
  templateUrl: './total-pending-payments-component.html',
  styleUrls:['./total-pending-payments-component.css']
})

export class TotalPendingPaymentComponent implements OnInit {

  public totalPendingAmount:number = 0;
  public totalInActiveClientPendingAmount = 0;
  public totalActiveClientPendingAmount:number = 0;
  private activeClients:Array<Customer> | null;
  private otherWorks :Array<OtherWorkDetailDTO> | null;

  constructor(
   private loaderService : LoaderService,
   private customerService:CustomerService,
   private _location:Location
  ) { }

  ngOnInit() {
     this.getPendingPaymentDetails();
   }

  calculateSum(data:Array<Customer>){
    let total = 0;
    if (data && data?.length > 0) {
      data.forEach(value => {
        total += value?.balanceAmount;
      });
    }
    return total;
  }

  backClicked() {
    this._location.back();
  }

  getPendingPaymentDetails = () => {
    this.loaderService.show();
    this.totalInActiveClientPendingAmount = this.totalActiveClientPendingAmount = this.totalPendingAmount = 0;
    this.customerService.getCustomersDetailsByContext('total-pending-payments').subscribe((result:any) => {
        this.loaderService.hide();
        if(result){
          this.activeClients = result.response?.customers;
          this.otherWorks = result.response?.otherWork;
          this.totalActiveClientPendingAmount = result.response?.totalActiveClientPendingAmount;
          this.totalInActiveClientPendingAmount = result.response?.totalInActiveClientPendingAmount;
          this.totalPendingAmount = result.response?.totalPendingAmount;
        }else {
          this.activeClients = null;
          this.otherWorks = null;
        }
    },err => this.loaderService.hide())
  }
}
