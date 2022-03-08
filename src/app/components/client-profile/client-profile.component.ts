import { isFunction } from 'lodash';
import { ClientReceivedPaymentsComponent } from './../client-received-payments/client-receive-payment-component';
import { ReceivePaymentComponent } from './../payment/add-payment/receive-payment-component';
import { Customer } from './../customer/create/models/customer-model';
import { LoaderService } from './../core/components/loader/loader.service';
import { CustomerService } from './../customer/service/customer-service';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { PaymentDetails } from '../payment/models/payment.model';
import { DrawerService } from '../shared/drawer/drawer.service';
import { Location } from '@angular/common';
import { ClientOtherWorkDetailsComponent } from '../client-other-work/client-other-work-details-component';
import { ClientItrDetailsComponent } from '../client-itr-details/client-itr-details.component';
import { ClientGstDetailsComponent } from '../client-gst-details/client-gst-details-component';
import { ClientAccountLedgerComponent } from '../client-account-ledger/client-account-ledger-component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  public customerId: number;
  public selectedCustomer: Customer;
  public paymentDetail: PaymentDetails | null;
  public selectedTab: number = 0;

  @ViewChild('addITRClientProfile') addITRTemplate: TemplateRef<any>;
  @ViewChild('addGstClientProfile') addGstTemplate: TemplateRef<any>;
  @ViewChild('addOtherWorkClientProfile') addOtherWorkTemplate: TemplateRef<any>;
  @ViewChild('receivePaymentTempClientProfile') receivePaymentTemplate: TemplateRef<any>;

  @ViewChild(ClientReceivedPaymentsComponent) private clientReceivedPaymentsComponent: ClientReceivedPaymentsComponent;
  @ViewChild(ClientOtherWorkDetailsComponent) private clientOtherWorkDetailsComponent: ClientOtherWorkDetailsComponent;
  @ViewChild(ClientItrDetailsComponent) private clientItrDetailsComponent: ClientItrDetailsComponent;
  @ViewChild(ClientGstDetailsComponent) private clientGstDetailsComponent: ClientGstDetailsComponent;
  @ViewChild(ClientAccountLedgerComponent) private clientAccountLedgerComponent: ClientAccountLedgerComponent;

  public drawerSubscription :Subscription;
  public routerSubscription :Subscription;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private _location: Location,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  this.routerSubscription = this.route.queryParams.subscribe((value) => {
      this.customerId = value['customerId'];
    });
    if (this.customerId > 0) {
      this.getClientDetails();
    }

    this.drawerSubscription = this.drawerService.drawerSubject.subscribe((value: boolean) => {
      if (!value) {
        this.refreshCustomerDetails();
      }
    });
  }

 ngOnDestroy(): void {
   if(this.drawerSubscription && isFunction(this.drawerSubscription.unsubscribe)){
     this.drawerSubscription.unsubscribe();
   }
   if(this.routerSubscription && isFunction(this.routerSubscription.unsubscribe)){
    this.routerSubscription.unsubscribe();
  }
 }

  onTabChanges = (data: any) => {
    this.selectedTab = data.index;
  }

  refreshCustomerDetails = () => {
    this.getClientDetails();
    switch (this.selectedTab) {
      case 0: {

      }
        break;
      case 1: {
        this.clientReceivedPaymentsComponent.refresh()
      }
        break;
      case 2: {
        this.clientAccountLedgerComponent.refresh()
      }
        break;
      case 3: {

        this.clientItrDetailsComponent.refresh()

      }
        break;
      case 4: {
        this.clientGstDetailsComponent.refresh()
      }
        break;
      case 5: {
        this.clientOtherWorkDetailsComponent.refresh()
      }
        break;
    }
  }

  onReceivePayment = (value: Customer) => {
    this.selectedCustomer = value;
    this.paymentDetail = this.getPaymentDetails(value);
    this.drawerService.openDrawer(this.receivePaymentTemplate, 'Receive Payment', 'payments');
  }

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
  }

  onEditCandidate = (customer: Customer) => {
    if (customer) {
      this.router.navigate(['/home/customer/create'], { queryParams: { customerId: customer.id } });
    }
  }

  onAddITR = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.drawerService.openDrawer(this.addITRTemplate, 'Add ITR')
  }

  onAddGST = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.drawerService.openDrawer(this.addGstTemplate, 'Add GST Detail')
  }

  onAddOtherWork = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.drawerService.openDrawer(this.addOtherWorkTemplate, 'Add Other Work')
  }

  onCloseDrawer = () => {
    //this.showAddItrDrawer = false;
  }

  getClientDetails = () => {
    this.loaderService.show();
    this.customerService.getCustomerDetailsById(this.customerId).subscribe((result: any) => {
      this.selectedCustomer = result.response;
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
    })
  }

}
