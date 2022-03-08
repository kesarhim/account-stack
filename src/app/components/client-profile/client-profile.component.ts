import { Customer } from './../customer/create/models/customer-model';
import { LoaderService } from './../core/components/loader/loader.service';
import { CustomerService } from './../customer/service/customer-service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { PaymentDetails } from '../payment/models/payment.model';
import { DrawerService } from '../shared/drawer/drawer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  public customerId: number;
  public selectedCustomer:Customer;
  public paymentDetail: PaymentDetails | null;

  @ViewChild('addITR') addITRTemplate: TemplateRef<any>;
  @ViewChild('addGst') addGstTemplate: TemplateRef<any>;
  @ViewChild('addOtherWork') addOtherWorkTemplate: TemplateRef<any>;
  @ViewChild('receivePaymentTemp') receivePaymentTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private _location:Location,
    private router: Router, private drawerService: DrawerService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
    this.route.queryParams.subscribe((value) => {
      this.customerId = value['customerId'];
    });
    if(this.customerId > 0){
      this.getClientDetails();
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
    this.customerService.getCustomerDetailsById(this.customerId).subscribe((result :any) => {
      this.selectedCustomer = result.response;
      this.loaderService.hide();
    },err => {
      this.loaderService.hide();
    })
  }

}
