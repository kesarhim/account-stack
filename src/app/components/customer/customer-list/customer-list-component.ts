import { ITableConfig, ITableColumn, ColumnType, ITableActionLinks } from './../../shared/table/models/table-config';
import { Router } from '@angular/router';
import { AlertService } from './../../core/components/alert/alert.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { HttpService } from './../../core/services/http.service';
import { Customer } from './../create/models/customer-model';
import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-customer-list-component',
  templateUrl: './customer-list-component.html',
  styleUrls:['./customer-list-component.css']
})

export class CustomerListComponent implements OnInit {

  displayedColumns: string[] = ['fullName', 'panNo', 'aadhaarNo','fatherName','email','mobileNo', 'dob','street',
  'city','pinCode',];
  dataSource: MatTableDataSource<Customer>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selectedCustomer:Customer;
  public showAddItrDrawer:boolean = false;

  public customerTableConfig : ITableConfig;

  constructor(private httpService :HttpService,
              private loaderService: LoaderService,
              private alertService :AlertService,
              private router: Router) {

  }

  ngOnInit() {
    this.createTableConfiguration();
    this.getAllCustomers(25);
  }

  createTableConfiguration = () => {
    let tableColumns :Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks : Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({linkName: 'Edit',icon: 'edit',showIcon:true,method: ($event:any) => this.onEditCandidate($event)});
    actionLinks.push({linkName: 'Add ITR',icon: 'add',showIcon:true,method: ($event:any) => this.onAddITR($event)});
    actionLinks.push({linkName: 'Edit Credentials',icon: 'edit',showIcon:true,method: ($event:any) => this.onEditCandidate($event)});
    actionLinks.push({linkName: 'Add Work',icon: 'add',showIcon:true,method: ($event:any) => this.onEditCandidate($event)});



    tableColumns.push({columnDef:'fullName',header:'Name',name: 'fullName',type:ColumnType.PRIMARY,actions:actionLinks});
    tableColumns.push({columnDef:'panNo',header:'Pan No',name:'panNo',showUpperCase:true});
    tableColumns.push({columnDef:'aadhaarNo',header:'Aadhaar No',name :'aadhaarNo'});
    tableColumns.push({columnDef:'email',header:'Email',name:'email'});
    tableColumns.push({columnDef:'fatherName',header:'Father Name',name:'fatherName'});
    tableColumns.push({columnDef:'mobileNo',header:'Mobile No',name:'mobileNo'});
    tableColumns.push({columnDef:'dob',header:'D.O.B',name:'dob'});
    tableColumns.push({columnDef:'street',header:'Street',name:'street'});
    tableColumns.push({columnDef:'city',header:'City',name:'city'});
    tableColumns.push({columnDef:'pinCode',header:'Pin Code',name:'pinCode'});
    this.customerTableConfig =  {
      displayedColumns:tableColumns
    }
  }

  getAllCustomers = (limitTo = 25) => {
      this.loaderService.show();
      this.httpService.get(`/Customer/GetAll?limitTo= ${limitTo}`).subscribe((result :any) => {
        if(result?.response && result?.response.length > 0){
          let data: Array<Customer> =  result?.response;
          data?.forEach(cust => {
            cust.fullName = `${cust.firstName} ${cust.middleName ?? ''} ${cust.lastName ?? ''}`
          })
          this.dataSource = new MatTableDataSource(data);
        }
        this.loaderService.hide();
      },err => {
        this.loaderService.hide();
      })
  }

  onEditCandidate = (customer:Customer) =>{
    if(customer){
      this.router.navigate(['/home/customer/create'],{ queryParams: { customerId: customer.id}});
    }
  }

  onAddCandidate = () =>{
      this.router.navigate(['/home/customer/create']);
  }

  onAddITR = (customer:Customer) =>{
    this.selectedCustomer = customer;
    this.showAddItrDrawer = true;
  }

  onCloseDrawer =() => {
     this.showAddItrDrawer = false;
  }
  ngAfterViewInit() {

    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

