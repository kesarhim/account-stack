import { OthweWorkDetailService } from './../../customer/service/other-work-detail-service';
import { OtherWorkDetail } from './../../customer/models/other-work-detail-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../../core/components/alert/alert.service';
import { LoaderService } from '../../core/components/loader/loader.service';
import { HttpService } from '../../core/services/http.service';
import { ITRDetailService } from '../../customer/service/itr-details-service';
import { CatalogData } from '../../shared/catalog-loader/models/catalog.model';
import { ConfirmationDialogService } from '../../shared/confim-dialog/confimation-dialog-service';
import { ITableConfig, ITableColumn, ITableActionLinks, ColumnType } from '../../shared/table/models/table-config';
import { OtherWorkDetailDTO } from './model/other-work-details-dto';

@Component({
  selector: 'app-view-other-work-list-component',
  templateUrl: './view-other-work-list-component.html',
  styleUrls:['./view-other-work-list-component.css']
})

export class ViewOtherWorkListComponent implements OnInit {
  dataSource: MatTableDataSource<OtherWorkDetailDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selectedOtherWork: OtherWorkDetailDTO;
  public showAddItrDrawer: boolean = false;
  public tableConfig: ITableConfig;

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: ConfirmationDialogService,
    private otherWorkService: OthweWorkDetailService) {

  }

  ngOnInit() {
    this.createTableConfiguration();
    this.getOtheWorkDetailsDetails(25);
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

  getOtheWorkDetailsDetails = (limitTo = 25) => {
    this.loaderService.show();
    this.otherWorkService.getAllOtherWorkDetailList(limitTo).subscribe((result: any) => {
      if (result?.response && result?.response.length > 0) {
        let data: Array<OtherWorkDetailDTO> = result?.response;
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
    })
  }

  onEditOtherDetail = (otherWorkDetail: OtherWorkDetailDTO) => {
    if (otherWorkDetail) {
      this.router.navigate(['/home/add/other-work'], { queryParams: { id: otherWorkDetail.id } });
    }
  }

  onSelectAssesmentYear = (assesmentYear: CatalogData) => {
    if (assesmentYear?.code) {
      this.getOtheWorkDetailsDetails(25);
    }
  }

  onAddOtherWork = () => {
    this.router.navigate(['/home/add/other-work']);
  }

  onDeleteOtherWork = (data: OtherWorkDetailDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.otherWorkService.delelteOtherWorkDetails(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("Work details deleted successfully.")
            this.getOtheWorkDetailsDetails(25);
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
