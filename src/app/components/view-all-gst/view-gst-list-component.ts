import { GSTDetailService } from './../customer/service/gst-details-service';
import { AlertService } from './../core/components/alert/alert.service';
import { ConfirmationDialogService } from './../shared/confim-dialog/confimation-dialog-service';
import { HttpService } from './../core/services/http.service';
import { LoaderService } from './../core/components/loader/loader.service';
import { Router } from '@angular/router';
import { style } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CatalogData } from '../shared/catalog-loader/models/catalog.model';
import { GSTDetailsDTO } from './model/gst-details-dto';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnType, ITableActionLinks, ITableColumn, ITableConfig } from '../shared/table/models/table-config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gst-list-component',
  templateUrl: './view-gst-list-component.html',
  styleUrls:['./view-gst-list-component.css']
})

export class GstListComponent implements OnInit {

  dataSource: MatTableDataSource<GSTDetailsDTO>;
  public selectedAssesmentYear:string = '4';
  public selectGstType : string ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public tableConfig: ITableConfig;

  constructor(private router:Router,
    private loaderService:LoaderService,
    private httpService :HttpService,
    private alertService:AlertService,
    private dialogService:ConfirmationDialogService,
    private gstDetailService: GSTDetailService) { }

  ngOnInit() {
    this.createTableConfiguration();
    this.getAllGSTDetails(25,"1");

   }

  onAddGST = () => {
    this.router.navigate(['home/customer/add/gst']);
  }

  onSelectGstType= (selectGstType: CatalogData) => {
    if (selectGstType?.code) {
      // this.getAllITRDetails(25, selectGstType.code);
    }
  }


  onSelectAssesmentYear = (assesmentYear: CatalogData) => {
    if (assesmentYear?.code) {
      // this.getAllITRDetails(25, assesmentYear.code);
    }
  }

  getAllGSTDetails = (limitTo = 25, assesmentYear: string) => {
    this.loaderService.show();
    this.httpService.get(`/GSTDetail/get/all`).subscribe((result: any) => {
      if (result?.response && result?.response.length > 0) {
        let data: Array<GSTDetailsDTO> = result?.response;
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.dataSource = new MatTableDataSource(undefined);
      }
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
    })

  }

  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditGSTDetail($event) });
    actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteGST($event) });
   // actionLinks.push({ linkName: 'Print Invoice', icon: 'print', showIcon: true, method: ($event: any) => this.onEditGSTDetail($event) });
   // actionLinks.push({ linkName: 'Receive Payment', icon: 'payments', showIcon: true, method: ($event: any) => this.onReceivePayment($event) });

    tableColumns.push({ columnDef: 'fullName', header: 'Name', name: 'fullName', type: ColumnType.PRIMARY, actions: actionLinks,applyFilter:true });
    tableColumns.push({ columnDef: 'panNo', header: 'Pan No', name: 'panNo', showUpperCase: true,applyFilter:true });
    tableColumns.push({ columnDef: 'totalfees', header: 'Total Fees', name: 'totalfees' });
    tableColumns.push({ columnDef: 'gstNumber', header: 'GST Number', name: 'gstNumber',applyFilter:true });
    tableColumns.push({ columnDef: 'gstTypeCode.description', header: 'GST Type', name: 'gstTypeCode.description',applyFilter:true });
    tableColumns.push({ columnDef: 'yearCode.description', header: 'Assesment Year', name: 'yearCode.description' });
    tableColumns.push({ columnDef: 'monthCode.description', header: 'Month', name: 'monthCode.description' });
    tableColumns.push({ columnDef: 'fileDate', header: 'File Date', name: 'fileDate', type: ColumnType.DATE });
    tableColumns.push({ columnDef: 'remark', header: 'Remark', name: 'remark' });
    tableColumns.push({ columnDef: 'doneBy', header: 'Done By', name: 'doneBy' });
    this.tableConfig = {
      displayedColumns: tableColumns
    }
  }
  onEditGSTDetail = (itrDetail: GSTDetailsDTO) => {
    if (itrDetail) {
      this.router.navigate(['/home/customer/add/gst'], { queryParams: { id: itrDetail.id } });
    }
  }

  onDeleteGST = (data: GSTDetailsDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.gstDetailService.delelteGstDetails(data.id).subscribe((result : any) => {
          if(result && result.response){
            this.alertService.success("GST details deleted successfully.")
            this.getAllGSTDetails(25,this.selectedAssesmentYear);
          }
        })
      }
    });
  }

  onSelectClient = (itrDetailDTO: GSTDetailsDTO) => {
    if(itrDetailDTO && itrDetailDTO?.customerId > 0){
      this.router.navigate(['/home/client-profile'], { queryParams: { customerId: itrDetailDTO.customerId } });
    }
  }


}


