import { DrawerService } from './../shared/drawer/drawer.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { HttpService } from '../core/services/http.service';
import { ITRDetailService } from '../customer/service/itr-details-service';
import { CatalogData } from '../shared/catalog-loader/models/catalog.model';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';
import { ITableConfig, ITableColumn, ITableActionLinks, ColumnType } from '../shared/table/models/table-config';
import { ITRDetailsDTO } from './model/itr-details-dto-model';

@Component({
  selector: 'app-view-itr-filled-component',
  templateUrl: './view-itr-filled-component.html',
  styleUrls: ['./view-itr-filled-component.css']
})

export class ViewITRFilledComponent implements OnInit {
  dataSource: MatTableDataSource<ITRDetailsDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('receivePayment') receivePaymentTemplate:TemplateRef<any>;
  public selectedITR: ITRDetailsDTO;
  public showAddItrDrawer: boolean = false;
  public selectedAssesmentYear:string = '4';
  public customerTableConfig: ITableConfig;

  constructor(private httpService: HttpService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: ConfirmationDialogService,
    private itrDetailService: ITRDetailService,
    private drawerService : DrawerService) {

  }

  ngOnInit() {
    this.createTableConfiguration();
    this.getAllITRDetails(25, '4');


  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditITRDetail($event) });
    actionLinks.push({ linkName: 'Receive Payment', icon: 'payments', showIcon: true, method: ($event: any) => this.onReceivePayment($event) });
    actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteITR($event) });
    actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => this.onEditITRDetail($event) });


    tableColumns.push({ columnDef: 'fullName', header: 'Name', name: 'fullName', type: ColumnType.PRIMARY, actions: actionLinks,applyFilter:true });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo', showUpperCase: true,applyFilter:true });
    tableColumns.push({ columnDef: 'ackNo', header: 'Acknowledgement No.', name: 'ackNo' });
    tableColumns.push({ columnDef: 'totalFees', header: 'Total Fees', name: 'totalFees' });
    tableColumns.push({ columnDef: 'feesPaid', header: 'Fees Paid', name: 'feesPaid' });
    tableColumns.push({ columnDef: 'balanceAmount', header: 'Balance', name: 'balanceAmount' });
    tableColumns.push({ columnDef: 'doneBy', header: 'Done By', name: 'doneBy' });
    tableColumns.push({ columnDef: 'fileDate', header: 'File Date', name: 'fileDate', type: ColumnType.DATE });
    tableColumns.push({ columnDef: 'taxAmount', header: 'Tax Amount', name: 'taxAmount' });
    tableColumns.push({ columnDef: 'refundAmount', header: 'Refund Amount', name: 'refundAmount' });
    tableColumns.push({ columnDef: 'remark', header: 'Remark', name: 'remark' });
    tableColumns.push({ columnDef: 'year.description', header: 'Assesment Year', name: 'year.description' });
    this.customerTableConfig = {
      displayedColumns: tableColumns
    }
  }

  getAllITRDetails = (limitTo = 25, assesmentYear: string) => {
    this.loaderService.show();
    this.httpService.get(`/ITRDetail/get/year?limitTo=${limitTo}&yearCode=${assesmentYear}`).subscribe((result: any) => {
      if (result?.response && result?.response.length > 0) {
        let data: Array<ITRDetailsDTO> = result?.response;
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
    })
  }

  onEditITRDetail = (itrDetail: ITRDetailsDTO) => {
    if (itrDetail) {
      this.router.navigate(['/home/customer/add/itr'], { queryParams: { id: itrDetail.id } });
    }
  }

  onSelectAssesmentYear = (assesmentYear: CatalogData) => {
    if (assesmentYear?.code) {
      this.getAllITRDetails(25, assesmentYear.code);
    }
  }

  onAddITR = () => {
    this.router.navigate(['home/customer/add/itr']);
  }

  onReceivePayment = (value:ITRDetailsDTO) =>{
     this.selectedITR = value;
     this.drawerService.openDrawer(this.receivePaymentTemplate,'Receive Payment');
  }

  onDeleteITR = (data: ITRDetailsDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.itrDetailService.delelteITR(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("ITR details deleted successfully.")
            this.getAllITRDetails(25,this.selectedAssesmentYear);
          }
        })
      }
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

}
