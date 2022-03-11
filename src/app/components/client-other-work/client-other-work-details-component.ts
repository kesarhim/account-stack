import { ColumnType, ITableActionLinks, ITableColumn, ITableConfig } from './../shared/table/models/table-config';
import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OtherWorkDetailDTO } from '../other-work/view-other-work-list/model/other-work-details-dto';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { OthweWorkDetailService } from '../customer/service/other-work-detail-service';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';
import { DrawerService } from '../shared/drawer/drawer.service';

@Component({
  selector: 'app-client-other-work-details-component',
  templateUrl: './client-other-work-details-component.html',
  styleUrls:['./client-other-work-details-component.css']
})

export class ClientOtherWorkDetailsComponent implements OnInit {
  dataSource: MatTableDataSource<OtherWorkDetailDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selectedOtherWork: OtherWorkDetailDTO;
  public showAddItrDrawer: boolean = false;
  public tableConfig: ITableConfig;
  @Input() set customerId(value: number) {
    if (value > 0) {
      this.selectedCustomerId = value;
      this.getCustomerOtherWorkDetails(value);
    }
  }

  @ViewChild('editOtherWork') editOtherWorkTemplate:TemplateRef<any>;
  private selectedCustomerId :number;
  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: ConfirmationDialogService,
    private otherWorkService: OthweWorkDetailService,
    private drawerService:DrawerService) {
      this.createTableConfiguration();
  }

  ngOnInit() {

  //  this.getOtheWorkDetailsDetails(25);
  }

  refresh = () => {
    this.getCustomerOtherWorkDetails(this.selectedCustomerId);
  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditOtherDetail($event) });
    actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteOtherWork($event) });
    actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => {}});


    tableColumns.push({ columnDef: 'clientName', header: 'Client Name', name: 'clientName', type: ColumnType.PRIMARY, actions: actionLinks });
    tableColumns.push({ columnDef: 'careOf', header: 'Care Of.', name: 'careOf' });
    tableColumns.push({ columnDef: 'totalFees', header: 'Total Fees', name: 'totalFees' });
    tableColumns.push({ columnDef: 'feesPaid', header: 'Fees Paid', name: 'feesPaid' });
    tableColumns.push({ columnDef: 'balanceAmount', header: 'Balance', name: 'balanceAmount' });

    tableColumns.push({ columnDef: 'fileDate', header: 'File Date', name: 'fileDate', type: ColumnType.DATE });
    tableColumns.push({ columnDef: 'fullName', header: 'Client Name ', name: 'fullName' });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo', showUpperCase: true });

    tableColumns.push({ columnDef: 'remark', header: 'Remark', name: 'remark' });
    tableColumns.push({ columnDef: 'doneBy', header: 'Done By', name: 'doneBy' });
    this.tableConfig = {
      displayedColumns: tableColumns
    }
  }

  getCustomerOtherWorkDetails = (customerId: number) => {
    this.loaderService.show();
    this.otherWorkService.getOtherWorkDetailsByCustomerId(customerId).subscribe((result: any) => {
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
      this.selectedOtherWork = otherWorkDetail;
      this.drawerService.openDrawer(this.editOtherWorkTemplate,'Edit Other Work','work');
      //this.router.navigate(['/home/add/other-work'], { queryParams: { id: otherWorkDetail.id } });
    }
  }

  onDeleteOtherWork = (data: OtherWorkDetailDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.otherWorkService.delelteOtherWorkDetails(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("Work details deleted successfully.");
            this.drawerService.closeDrawer();
            this.getCustomerOtherWorkDetails(this.selectedCustomerId);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
