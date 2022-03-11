import { ReceivePaymentDTO } from './../payment/models/receive-payment-dto';
import { Router } from '@angular/router';
import { LoaderService } from './../core/components/loader/loader.service';
import { Customer } from './../customer/create/models/customer-model';
import { InvoiceDetailDTO } from './../client-account-ledger/account-ledger-model';
import { CustomerService } from './../customer/service/customer-service';
import { InvoiceService } from './../customer/service/invoice-service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-receipt-component',
  templateUrl: './print-receipt-component.html',
  styleUrls: ['./print-receipt-component.css']
})

export class PrintReceiptComponent implements OnInit {

  @Input() receivedPayment : ReceivePaymentDTO;
  @Input() customer:Customer;

  public currentDate:Date = new Date();
  constructor(private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private loaderService: LoaderService,
    private router:Router) { }

  ngOnInit() {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // }
  }

  // getInvoiceDetail = (invoiceId:number) => {
  //   this.invoice = new InvoiceDetailDTO();
  //   this.customer = new Customer();
  //   if(invoiceId > 0){
  //     this.loaderService.show();
  //     this.invoiceService.getInvoiceDetailsById(invoiceId).subscribe((result: any) => {
  //       if (result && result?.response) {
  //         this.invoice = result.response;
  //         if (this.invoice) {
  //           this.customerService.getCustomerDetailsById(this.invoice.customerid).subscribe((data: any) => {
  //             this.customer = data?.response;
  //             this.loaderService.hide();
  //           });
  //         }else {
  //           this.loaderService.hide();
  //         }
  //       }
  //     },err=> this.loaderService.hide());
  //   }

  // }
}
