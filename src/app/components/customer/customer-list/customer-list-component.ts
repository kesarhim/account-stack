import { Subscription } from 'rxjs';
import { DrawerService } from './../../shared/drawer/drawer.service';
import { ITableConfig, ITableColumn, ColumnType, ITableActionLinks } from './../../shared/table/models/table-config';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from './../../core/components/alert/alert.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { HttpService } from './../../core/services/http.service';
import { Customer } from './../create/models/customer-model';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDetails } from '../../payment/models/payment.model';

@Component({
  selector: 'app-customer-list-component',
  templateUrl: './customer-list-component.html',
  styleUrls: ['./customer-list-component.css']
})

export class CustomerListComponent implements OnInit {

  displayedColumns: string[] = ['fullName', 'panNo', 'aadhaarNo', 'fatherName', 'email', 'mobileNo', 'dob', 'street',
    'city', 'pinCode',];
  dataSource: MatTableDataSource<Customer>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('addITR') addITRTemplate: TemplateRef<any>;
  @ViewChild('addGst') addGstTemplate: TemplateRef<any>;
  @ViewChild('addOtherWork') addOtherWorkTemplate: TemplateRef<any>;
  @ViewChild('receivePaymentTemp') receivePaymentTemplate: TemplateRef<any>;

  public paymentDetail:PaymentDetails | null;
  public selectedCustomer: Customer;
  public showAddItrDrawer: boolean = false;
  public customerTableConfig: ITableConfig;
  private drawerSubscription: Subscription;

  constructor(private httpService: HttpService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router, private drawerService: DrawerService) {

  }

  ngOnInit() {
    this.createTableConfiguration();
    this.getAllCustomers(25);
  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditCandidate($event) });
    actionLinks.push({ linkName: 'Edit Credentials', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditCandidate($event) });
    actionLinks.push({ linkName: 'Add ITR', icon: 'add', showIcon: true, method: ($event: any) => this.onAddITR($event) });
    actionLinks.push({ linkName: 'Add GST', icon: 'add', showIcon: true, method: ($event: any) => this.onAddGST($event) });
    actionLinks.push({ linkName: 'Add Other Work', icon: 'add', showIcon: true, method: ($event: any) => this.onAddOtherWork($event) });
    actionLinks.push({ linkName: 'Receive Payment', icon: 'payments', showIcon: true, method: ($event: any) => this.onReceivePayment($event) });


    tableColumns.push({ columnDef: 'fullName', header: 'Name', name: 'fullName', type: ColumnType.PRIMARY, actions: actionLinks, applyFilter: true });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo', showUpperCase: true, applyFilter: true });
    tableColumns.push({ columnDef: 'aadhaarNo', header: 'Aadhaar No', name: 'aadhaarNo', applyFilter: true });
    tableColumns.push({ columnDef: 'email', header: 'Email', name: 'email' });
    tableColumns.push({ columnDef: 'fatherName', header: 'Father Name', name: 'fatherName' });
    tableColumns.push({ columnDef: 'mobileNo', header: 'Mobile No', name: 'mobileNo' });
    tableColumns.push({ columnDef: 'dob', header: 'D.O.B', name: 'dob',type: ColumnType.DATE});
    tableColumns.push({ columnDef: 'street', header: 'Street', name: 'street' });
    tableColumns.push({ columnDef: 'city', header: 'City', name: 'city' });
    tableColumns.push({ columnDef: 'pinCode', header: 'Pin Code', name: 'pinCode' });
    this.customerTableConfig = {
      displayedColumns: tableColumns
    }
  }

  onReceivePayment = (value: Customer) => {
    this.selectedCustomer = value;
    this.paymentDetail = this.getPaymentDetails(value);
    this.drawerService.openDrawer(this.receivePaymentTemplate, 'Receive Payment', 'payments');
  }

  getPaymentDetails = (itrDetails: Customer) : PaymentDetails | null=> {
    if (itrDetails) {
      let paymentDetails: PaymentDetails = new PaymentDetails();
      paymentDetails.customerId = itrDetails.id;
    //  paymentDetails.totalFees = itrDetails.totalFees;
   //   paymentDetails.feesPaid = itrDetails.feesPaid;
  //    paymentDetails.balanceAmount = itrDetails.balanceAmount;
      paymentDetails.clientName = itrDetails.fullName;
      paymentDetails.panNo = itrDetails.panNo;
      paymentDetails.contextKey = 'CUSTOMER';
      return paymentDetails;
    }
    return null;
  }

  getAllCustomers = (limitTo = 25) => {
    this.loaderService.show();
    this.httpService.get(`/Customer/GetAll?limitTo= ${limitTo}`).subscribe((result: any) => {
      if (result?.response && result?.response.length > 0) {
        let data: Array<Customer> = result?.response;

        if (data?.length > 0) {
          data = data.sort((a, b) => {
            if (a.firstName > b.firstName) return 1;
            if (a.firstName < b.firstName) return -1;
            return 0;
          })
          data?.forEach(cust => {
            cust.fullName = `${cust.firstName} ${cust.middleName ?? ''} ${cust.lastName ?? ''}`
          });
        }
        this.dataSource = new MatTableDataSource(data);
      }
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
    })
  }

  onEditCandidate = (customer: Customer) => {
    if (customer) {
      this.router.navigate(['/home/customer/create'], { queryParams: { customerId: customer.id } });
    }
  }

  onAddCandidate = () => {
    this.router.navigate(['/home/customer/create']);
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
    this.showAddItrDrawer = false;
  }

  onSelectClient=(customer:Customer )=>{
    // alert("on custmer list component");
    this.router.navigate(['/home/client-profile'],{ queryParams: { customerId: customer.id } });

  }
}

