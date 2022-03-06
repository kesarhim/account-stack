import { AlertService } from './../core/components/alert/alert.service';
import { LoaderService } from './../core/components/loader/loader.service';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '../customer/service/customer-service';
import { AccountLedgerDTO } from './account-ledger-model';

@Component({
  selector: 'app-client-account-ledger-component',
  templateUrl: 'client-account-ledger-component.html',
  styleUrls: ['./client-account-ledger-component.css']
})

export class ClientAccountLedgerComponent implements OnInit {
  @Input() set customerId(value: number) {
    if(value){
      this.selectedCustomerId = value;
      this.getAccountLedger(this.selectedCustomerId);
    }
  };
  public selectedCustomerId: number;
  public accountLedger: AccountLedgerDTO;
  constructor(
    private customerService: CustomerService,
    private loaderService : LoaderService,
    private alertService:AlertService
  ) { }


  ngOnInit() { }

  getAccountLedger = (customerId: number) => {
    if (customerId && customerId > 0) {
      this.loaderService.show();
      this.customerService.getCustomerAccountLedger(customerId).subscribe((result: any) => {
        if (result) {
          this.accountLedger = result.response;
          this.loaderService.hide();
        }
      },err => {
        this.loaderService.hide();
        this.alertService.error(err?.error?.message);
      });
    }
  }
}
