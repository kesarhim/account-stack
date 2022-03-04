import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { HttpService } from '../core/services/http.service';
import { ITRDetailService } from '../customer/service/itr-details-service';
import { ConfirmationDialogService } from '../shared/confim-dialog/confimation-dialog-service';
import { DrawerService } from '../shared/drawer/drawer.service';
import { ColumnType, ITableActionLinks, ITableColumn } from '../shared/table/models/table-config';

@Component({
  selector: 'app-client-itr-details',
  templateUrl: './client-itr-details.component.html',
  styleUrls: ['./client-itr-details.component.css']
})
export class ClientItrDetailsComponent implements OnInit {
  customerTableConfig: { displayedColumns: ITableColumn[]; };

  constructor(private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private alertService: AlertService,

    private dialogService: ConfirmationDialogService,
    private itrDetailService: ITRDetailService,
    private drawerService: DrawerService) { }

  ngOnInit(): void {
  }
  createTableConfiguration = () => {
    let tableColumns: Array<ITableColumn> = new Array<ITableColumn>();
    let actionLinks: Array<ITableActionLinks> = new Array<ITableActionLinks>();

    actionLinks.push({ linkName: 'Edit', icon: 'edit', showIcon: true, method: ($event: any) => this.onEditITRDetail($event) });
    actionLinks.push({ linkName: 'Delete', icon: 'delete', showIcon: true, method: ($event: any) => this.onDeleteITR($event) });

    tableColumns.push({ columnDef: 'totalFees', header: 'Total Fees', name: 'totalFees' });
    tableColumns.push({ columnDef: 'ackNo', header: 'Acknowledgement No.', name: 'ackNo' });
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

  onEditITRDetail = (itrDetail: ITRDetailsDTO) => {
    if (itrDetail) {
      this.router.navigate(['/home/customer/add/itr'], { queryParams: { id: itrDetail.id } });
    }
  }

  onDeleteITR = (data: ITRDetailsDTO) => {
    this.dialogService.showConfirmationDialog("Do you really want to delete the selected item?").subscribe(value => {
      if (value) {
        this.loaderService.show();
        this.itrDetailService.delelteITR(data.id).subscribe((result: any) => {
          if (result && result.response) {
            this.alertService.success("ITR details deleted successfully.")
            this.getAllITRDetails(25, this.selectedAssesmentYear);
          }
        })
      }
    });
  }
}
