import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { ReceivePaymentDTO } from '../payment/models/receive-payment-dto';
import { ReceivePaymentService } from '../payment/service/receive-payment-service';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';
import { ITableConfig, ITableColumn, ITableActionLinks, ColumnType } from '../shared/table/models/table-config';

@Component({
  selector: 'app-today-received-payment',
  templateUrl: 'today-received-payment-component.html',
  styleUrls:['./today-received-payment-component.css']
})

export class TodayReceivedPayments implements OnInit {
  dataSource: MatTableDataSource<ReceivePaymentDTO>;
  otherClientdataSource:MatTableDataSource<ReceivePaymentDTO>;
  public selectedOtherWork: ReceivePaymentDTO;
  public showAddItrDrawer: boolean = false;
  public tableConfig: ITableConfig;
  public totalAmountReceived : number = 0;
  @Input() actionAllowed:boolean  = false;
  private selectedCustomerId :number;
  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: ConfirmationDialogService,
    private receivePaymentService: ReceivePaymentService,
    private _location:Location) {
      this.createTableConfiguration();
  }

  ngOnInit() {
    this.getTodayReceivedPayment();
  //  this.getOtheWorkDetailsDetails(25);
  }

  onSelectClient = (itrDetailDTO: ReceivePaymentDTO) => {
    if(itrDetailDTO && itrDetailDTO?.customerid > 0){
      this.router.navigate(['/home/client-profile'], { queryParams: { customerId: itrDetailDTO.customerid } });
    }
  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    if(this.actionAllowed){
      actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditPaymentDetail($event) });
      actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeletePayment($event) });
      actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => {}});
    }

    tableColumns.push({ columnDef: 'clientName', header: 'Client Name', name: 'clientName' ,type: ColumnType.PRIMARY,actions: actionLinks,applyFilter:true });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo',showUpperCase:true,applyFilter:true});
    tableColumns.push({ columnDef: 'receivedAmount', header: 'Received Amount', name: 'receivedAmount'});
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

  calculateSum(data:Array<ReceivePaymentDTO>){
    let total = 0;
    if (data && data?.length > 0) {
      data.forEach(value => {
        total += value?.receivedAmount;
      });
    }
    return total;
  }

  getTodayReceivedPayment = () => {
    this.loaderService.show();
    this.totalAmountReceived =0;
    this.receivePaymentService.getTodayPaymentDetails().subscribe((result: any) => {
      if (result && result.response) {
        let data :Array<ReceivePaymentDTO> = result.response;
        if(data && data.length > 0){
          this.dataSource = new MatTableDataSource(data.filter(x=> !x.isNonExistingClient));
          this.otherClientdataSource = new MatTableDataSource(data.filter(x=> x.isNonExistingClient));
        }
        this.totalAmountReceived = this.calculateSum(data);
      }else {
        this.dataSource = new MatTableDataSource(undefined);
        this.otherClientdataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();

    }, err => this.loaderService.hide())
  }


  onEditPaymentDetail = (otherWorkDetail: ReceivePaymentDTO) => {
    if (otherWorkDetail) {
      //this.router.navigate(['/home/add/other-work'], { queryParams: { id: otherWorkDetail.id } });
    }
  }

  onDeletePayment = (data: ReceivePaymentDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.receivePaymentService.deletePaymentDetails(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("Deleted successfully.")
            this.getTodayReceivedPayment();
          }
        })
      }
    },err => this.loaderService.hide());
  }

  backClicked() {
    this._location.back();
  }
}
