import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { isFunction } from 'lodash';
import { Subscription } from 'rxjs';
import { ClientAccountLedgerComponent } from '../../client-account-ledger/client-account-ledger-component';
import { AlertService } from '../../core/components/alert/alert.service';
import { LoaderService } from '../../core/components/loader/loader.service';
import { Customer } from '../../customer/create/models/customer-model';
import { CustomerService } from '../../customer/service/customer-service';
import { DrawerService } from '../../shared/drawer/drawer.service';
import { PaymentDetails } from '../models/payment.model';

@Component({
  selector: 'app-customer-payment-history',
  templateUrl: './customer-payment-history-component.html',
  styleUrls: ['./customer-payment-history-component.css'],
})
export class CustomerPaymentHistoryComponent implements OnInit, OnDestroy {
  @ViewChild('receivePaymentTemplate') receivePaymentTemplate: TemplateRef<any>;
  @ViewChild('invoiceTemplate') invoiceTemplate: TemplateRef<any>;

  @ViewChild(ClientAccountLedgerComponent) clientAccountLedgerComponent: ClientAccountLedgerComponent;
  public drawerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private _location: Location,
    private router: Router,
    private drawerService: DrawerService
  ) {}

  public selectedCustomer: Customer | null;
  public customerId: number;
  public paymentDetail: PaymentDetails | null;

  ngOnInit() {
    this.drawerSubscription = this.drawerService.drawerSubject.subscribe(
      (value) => {
        if (!value) {
          this.onSelectCustomer(this.selectedCustomer);
          this.clientAccountLedgerComponent.refresh()
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (
      this.drawerSubscription &&
      isFunction(this.drawerSubscription.unsubscribe)
    ) {
      this.drawerSubscription.unsubscribe();
    }
  }

  onSelectCustomer = (customer: Customer | null) => {
    this.selectedCustomer = customer;
    if (this.selectedCustomer) {
      this.loaderService.show();
      this.customerService.getCustomerDetailsById(this.selectedCustomer.id).subscribe(
        (result: any) => {
          this.loaderService.hide();
          if (result) {
            this.selectedCustomer = result.response;
          }
        },
        (err) => this.loaderService.hide()
      );
    }
  };

  backClicked() {
    this._location.back();
  }

  getPaymentDetails = (customerDetail: Customer): PaymentDetails | null => {
    if (customerDetail) {
      let paymentDetails: PaymentDetails = new PaymentDetails();
      paymentDetails.customerId = customerDetail.id;
      paymentDetails.totalFees = customerDetail.totalFees;
      paymentDetails.feesPaid = customerDetail.feesPaid;
      paymentDetails.balanceAmount = customerDetail.balanceAmount;
      paymentDetails.clientName = customerDetail.fullName;
      paymentDetails.panNo = customerDetail.panNo;
      paymentDetails.discountOffered = customerDetail.discountOffered;
      paymentDetails.contextKey = 'CUSTOMER';
      return paymentDetails;
    }
    return null;
  };

  onReceivePayment = (value: Customer) => {
    this.selectedCustomer = value;
    this.paymentDetail = this.getPaymentDetails(value);
    this.drawerService.openDrawer(
      this.receivePaymentTemplate,
      'Receive Payment',
      'payments'
    );
  };

  onEditCandidate = (customer: Customer) => {
    if (customer) {
      this.router.navigate(['/home/customer/create'], {
        queryParams: { customerId: customer.id },
      });
    }
  };

  onCreateInvoice() {
    this.drawerService.openDrawer(
      this.invoiceTemplate,
      'Create Invoice',
      'payments'
    );
  }
}
