import { Router } from '@angular/router';
import { LoaderService } from '../core/components/loader/loader.service';
import { InvoiceDetailDTO } from '../client-account-ledger/account-ledger-model';
import { InvoiceService } from '../customer/service/invoice-service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITableColumn, ITableActionLinks, ColumnType, ITableConfig } from '../shared/table/models/table-config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account-summary-component',
  templateUrl: './today-acccount-summary-component.html',
  styleUrls: ['./today-acccount-summary-component.css']
})

export class TodayAccountSummaryComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private loaderService: LoaderService,
    private router: Router,
    private _location:Location) {
      this.createTableConfiguration();
    }

  clientDataSource: MatTableDataSource<InvoiceDetailDTO>;
  otherClientdataSource: MatTableDataSource<InvoiceDetailDTO>;
  public contextKey: string;
  public invoices: Array<InvoiceDetailDTO>;
  public totalBill: number = 0;
  public totalActiveClientBill: number = 0;
  public totalNonActiveClientBill: number = 0;
  public tableConfig: ITableConfig;


  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.contextKey = value['contextKey'];
    });
    this.getTodayInvoices();
  }

  getTodayInvoices = () => {
    this.loaderService.show();
    this.invoiceService.getTodayInvoices().subscribe((result: any) => {
      this.loaderService.hide();
      this.invoices = result?.response;
      this.totalBill = 0;
      this.totalActiveClientBill = 0;
      this.totalNonActiveClientBill =0;
      if(this.invoices && this.invoices.length > 0){
        let existingClientInvoice = this.invoices.filter(x => !x.isNonExistingClient);
        this.clientDataSource = new MatTableDataSource(existingClientInvoice);
        let otherClient  =  this.invoices.filter(x => x.isNonExistingClient);
        this.otherClientdataSource = new MatTableDataSource(otherClient);
      }else {
        this.clientDataSource = new MatTableDataSource(undefined);
        this.clientDataSource = new MatTableDataSource(undefined);
      }
      this.totalBill = this.calculateSum(this.invoices);
      this.totalActiveClientBill = this.calculateSum(this.clientDataSource.data);
      this.totalNonActiveClientBill = this.calculateSum(this.otherClientdataSource.data);
    }, err => this.loaderService.hide());
  }

  calculateSum(data:Array<InvoiceDetailDTO>){
    let total = 0;
    if (data && data?.length > 0) {
      data.forEach(value => {
        total += value?.invoiceAmount;
      });
    }
    return total;
  }

  goToClientDetails = (clientId: number) => {
    if (clientId) {
      this.router.navigate(['/home/client-profile'], { queryParams: { customerId: clientId } });
    }
  }


  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();


    // actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditOtherDetail($event) });
    // actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteOtherWork($event) });
    // actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => {}});
    // actionLinks.push({ linkName: 'Receive Payment', icon: 'payments', showIcon: true, method: ($event: any) => this.onReceivePayment($event) });
    // actionLinks.push({ linkName: 'Payment History', icon: 'history', showIcon: true, method: ($event: any) => this.viewPaymentHistory($event) });

   // actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditITRDetail($event) });
    // actionLinks.push({ linkName: 'Receive Payment', icon: 'payments', showIcon: true, method: ($event: any) => this.onReceivePayment($event) });
   // actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteITR($event) });
    //   actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => this.onEditITRDetail($event) });


    tableColumns.push({ columnDef: 'clientName', header: 'Client Name', name: 'clientName', type: ColumnType.PRIMARY, actions: actionLinks, applyFilter: true });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo', showUpperCase: true, applyFilter: true });
    tableColumns.push({ columnDef: 'invoiceAmount', header: 'Bill Amount', name: 'invoiceAmount' });
    tableColumns.push({ columnDef: 'contextType', header: 'Work Type', name: 'contextType' });
    tableColumns.push({ columnDef: 'creator', header: 'Done By', name: 'creator' });
    tableColumns.push({ columnDef: 'invoiceDate', header: 'Date', name: 'invoiceDate', type: ColumnType.DATE });
    this.tableConfig = {
      displayedColumns: tableColumns
    }
  }

  onEditITRDetail = (itrDetail: InvoiceDetailDTO) => {
    // if (itrDetail) {
    //   this.router.navigate(['/home/customer/add/itr'], { queryParams: { id: itrDetail.id } });
    // }
  }

  onDeleteITR = (itrDetail: InvoiceDetailDTO) =>{

  }

  backClicked() {
    this._location.back();
  }


  onSelectClient = (itrDetailDTO: InvoiceDetailDTO) => {
    if(itrDetailDTO && itrDetailDTO?.customerid > 0){
      this.router.navigate(['/home/client-profile'], { queryParams: { customerId: itrDetailDTO.customerid } });
    }
  }

  onEditOtherDetail = (otherWorkDetail: InvoiceDetailDTO) => {
    if (otherWorkDetail) {
      this.router.navigate(['/home/add/other-work'], { queryParams: { id: otherWorkDetail.contextKey } });
    }
  }


  // onDeleteOtherWork = (data: InvoiceDetailDTO) => {
  //   this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
  //     if (value) {
  //       this.loaderService.show();
  //       this.otherWorkService.delelteOtherWorkDetails(data.id).subscribe((result : any) => {
  //         if(result && result.response){
  //           this.alertService.success("Work details deleted successfully.")
  //           this.getOtheWorkDetailsDetails(25);
  //         }
  //       })
  //     }
  //   });
  // }

}
