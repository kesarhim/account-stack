import { MatPaginator } from '@angular/material/paginator';
import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';
import { DrawerService } from '../shared/drawer/drawer.service';
import { ColumnType, ITableActionLinks, ITableColumn } from '../shared/table/models/table-config';
import { ITRDetailsDTO } from '../view-itr/model/itr-details-dto-model';
import { MatSort } from '@angular/material/sort';
import { GSTDetailsDTO } from '../view-all-gst/model/gst-details-dto';
import { GSTDetailService } from '../customer/service/gst-details-service';

@Component({
  selector: 'app-client-gst-details',
  templateUrl: './client-gst-details-component.html',
  styleUrls: ['./client-gst-detail-component.css']
})
export class ClientGstDetailsComponent implements OnInit {
  @Input() set customerId(value: number) {
    if (value > 0) {
      this.selectedCustomerId = value;
      this.getCustomerGstDetails(value);
    }
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editGst') editGstTemplate :TemplateRef<any>;
  selectedCustomerId : number;
  tableConfig: { displayedColumns: ITableColumn[]; };
  public selectedGst: GSTDetailsDTO;
  dataSource: MatTableDataSource<ITRDetailsDTO>;

  constructor(private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,

    private dialogService: ConfirmationDialogService,
    private gstDetailService: GSTDetailService,
    private drawerService: DrawerService) {
    this.createTableConfiguration();

  }

  ngOnInit(): void {
  }

  getCustomerGstDetails = (customerId: number) => {
    this.loaderService.show();
    this.gstDetailService.getGstDetailsByCustomerId(customerId).subscribe((result: any) => {
      if (result && result.response) {
        this.dataSource = new MatTableDataSource(result.response);
      } else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();

    }, err => this.loaderService.hide())
  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditGSTDetail($event) });
    actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteGST($event) });
    actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => this.onPrintInvoice($event) });

    tableColumns.push({ columnDef: 'gstTypeCode.description', header: 'GST Type', name: 'gstTypeCode.description',  type: ColumnType.PRIMARY, actions: actionLinks, applyFilter: true });
    tableColumns.push({ columnDef: 'totalfees', header: 'Total Fees', name: 'totalfees' });
    tableColumns.push({ columnDef: 'gstNumber', header: 'GST Number', name: 'gstNumber', applyFilter: true });
    tableColumns.push({ columnDef: 'yearCode.description', header: 'FY Year', name: 'yearCode.description' });
    tableColumns.push({ columnDef: 'monthCode.description', header: 'Month', name: 'monthCode.description' });
    tableColumns.push({ columnDef: 'fileDate', header: 'File Date', name: 'fileDate', type: ColumnType.DATE });
    tableColumns.push({ columnDef: 'remark', header: 'Remark', name: 'remark' });
    tableColumns.push({ columnDef: 'doneBy', header: 'Done By', name: 'doneBy' });
    this.tableConfig = {
      displayedColumns: tableColumns
    }
  }
  onEditGSTDetail = (gstDetail: GSTDetailsDTO) => {
    if (gstDetail) {
      this.selectedGst = gstDetail;
      this.drawerService.openDrawer(this.editGstTemplate,'Edit Gst Detail','work');
   //   this.router.navigate(['/home/customer/add/gst'], { queryParams: { id: itrDetail.id } });
    }
  }

  onPrintInvoice = (itrDetail: GSTDetailsDTO) => {
     alert("Under Construction ");
  }

  onDeleteGST = (data: GSTDetailsDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.gstDetailService.delelteGstDetails(data.id).subscribe((result: any) => {
          if (result && result.response) {
            this.loaderService.hide();
            this.alertService.success("GST details deleted successfully.")
            this.getCustomerGstDetails(this.selectedCustomerId);
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

}
