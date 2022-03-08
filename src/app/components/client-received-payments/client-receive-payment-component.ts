import { ReceivePaymentService } from './../payment/service/receive-payment-service';
import { ColumnType, ITableActionLinks, ITableColumn, ITableConfig } from './../shared/table/models/table-config';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OtherWorkDetailDTO } from '../other-work/view-other-work-list/model/other-work-details-dto';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { OthweWorkDetailService } from '../customer/service/other-work-detail-service';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';

@Component({
  selector: 'app-client-receive-payment-component',
  templateUrl: './client-receive-payment-component.html',
  styleUrls:['./client-receive-payment-component.css']
})

export class ClientReceivedPaymentsComponent implements OnInit {
  dataSource: MatTableDataSource<OtherWorkDetailDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selectedOtherWork: OtherWorkDetailDTO;
  public showAddItrDrawer: boolean = false;
  public tableConfig: ITableConfig;
  @Input() set invoiceId (value :number){
    if(value){
      this.getCustomerReceivedPaymentsByInvoiceId(value);
    }
  }
  @Input() set customerId(value: number) {
    if (value > 0) {
      this.selectedCustomerId = value;
      this.getCustomerReceivedPayments(value);
    }
  }
  @Input() actionAllowed:boolean  = false;
  private selectedCustomerId :number;
  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: ConfirmationDialogService,
    private receivePaymentService: ReceivePaymentService) {

  }

  ngOnInit() {
    this.createTableConfiguration();
  //  this.getOtheWorkDetailsDetails(25);
  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    if(this.actionAllowed){
      actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditOtherDetail($event) });
      actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteOtherWork($event) });
      actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => {}});
    //  tableColumns.push({ columnDef: 'action', header: 'Action', name: 'action', type: ColumnType.PRIMARY, actions: actionLinks });
    }


    tableColumns.push({ columnDef: 'receivedAmount', header: 'Received Amount', name: 'receivedAmount' ,type: ColumnType.PRIMARY,actions: actionLinks });
    tableColumns.push({ columnDef: 'receivedDate', header: 'Received Date', name: 'receivedDate', type: ColumnType.DATETIME });
    tableColumns.push({ columnDef: 'receivedBy', header: 'Received By', name: 'receivedBy' });
    tableColumns.push({ columnDef: 'receivedMethod', header: 'Payment Method', name: 'receivedMethod' });
    tableColumns.push({ columnDef: 'chequeNo', header: 'Cheque No', name: 'chequeNo', showUpperCase: true });
    tableColumns.push({ columnDef: 'transactionNo', header: 'Transaction No', name: 'transactionNo', showUpperCase: true });
    tableColumns.push({ columnDef: 'discountOffered', header: 'Discount Offered', name: 'discountOffered' });

    tableColumns.push({ columnDef: 'remark', header: 'Remark', name: 'remark' });

    this.tableConfig = {
      displayedColumns: tableColumns
    }
  }

  getCustomerReceivedPaymentsByInvoiceId = (invoiceId: number) => {
    this.loaderService.show();
    this.receivePaymentService.getReceiveDetailsByInvoiceId(invoiceId).subscribe((result: any) => {
      if (result && result.response) {
        this.dataSource = new MatTableDataSource(result.response);
      }else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();

    }, err => this.loaderService.hide())
  }

  getCustomerReceivedPayments = (customerId: number) => {
    this.loaderService.show();
    this.receivePaymentService.getReceiveDetailsByCustomerId(customerId).subscribe((result: any) => {
      if (result && result.response) {
        this.dataSource = new MatTableDataSource(result.response);
      }else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();

    }, err => this.loaderService.hide())
  }

  onEditOtherDetail = (otherWorkDetail: OtherWorkDetailDTO) => {
    if (otherWorkDetail) {
      this.router.navigate(['/home/add/other-work'], { queryParams: { id: otherWorkDetail.id } });
    }
  }

  onAddOtherWork = () => {
    this.router.navigate(['/home/add/other-work']);
  }

  onDeleteOtherWork = (data: OtherWorkDetailDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.receivePaymentService.deletePaymentDetails(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("Deleted successfully.")
            this.getCustomerReceivedPayments(this.selectedCustomerId);
          }
        })
      }
    },err => this.loaderService.hide());
  }

  ngAfterViewInit() {
    if (this.dataSource) {
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
