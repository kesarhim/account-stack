import { AlertService } from './../core/components/alert/alert.service';
import { LoaderService } from './../core/components/loader/loader.service';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '../customer/service/customer-service';
import { AccountLedgerDTO, InvoiceDetailDTO } from './account-ledger-model';

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
  public accountLedger: AccountLedgerDTO  | null;
  public totalBill : number = 0;
  public totalReceivedAmount : number = 0;
  constructor(
    private customerService: CustomerService,
    private loaderService : LoaderService,
    private alertService:AlertService
  ) { }


  ngOnInit() {
  }

  refresh = () => {
    this.getAccountLedger(this.selectedCustomerId);
  }

  onDeleteInvoice = (invoice:InvoiceDetailDTO) => {

  }

  onEditInvoice = (invoice:InvoiceDetailDTO) => {

  }
  getAccountLedger = (customerId: number) => {
    if (customerId && customerId > 0) {
      this.loaderService.show();
      this.customerService.getCustomerAccountLedger(customerId).subscribe((result: any) => {
        if (result) {
          this.accountLedger = result.response;
          this.totalBill = 0;
          this.totalReceivedAmount = 0;
           if(this.accountLedger && this.accountLedger?.invoices?.length > 0){
              this.accountLedger.invoices.forEach(value => {
                this.totalBill += value?.invoiceAmount;
              });
           }
           if(this.accountLedger && this.accountLedger?.paymentHistory?.length > 0){
            this.accountLedger.paymentHistory.forEach(payment => {
              this.totalReceivedAmount += (payment?.receivedAmount + payment.discountOffered);
            });
         }
          this.loaderService.hide();
        }
      },err => {
        this.accountLedger = null;
        this.loaderService.hide();
        this.alertService.error(err?.error?.message);
      });
    }
  }
}
