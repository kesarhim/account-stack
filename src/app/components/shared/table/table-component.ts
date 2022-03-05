import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnType, ITableConfig, ITableFilter } from './models/table-config';
import * as _ from 'lodash';

export class Balance {
  static readonly PENDING = 'PENDING';
  static readonly COMPLETED = 'COMPLETED';
}

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.html',
  styleUrls: ['./table-component.css'],
})
export class TableComponentComponent implements OnInit {
  @Input() tableDataSource: MatTableDataSource<any>;
  @Input() tableConfig: ITableConfig;
  @Input() allowSearch:boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onSelectProfile: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: Array<string>;
  public tableFilterSource: Array<ITableFilter>;
  public pendingBalance: Array<string> = new Array<string>(
    ...[Balance.PENDING, Balance.COMPLETED]
  );

  constructor() {}

  ngOnInit() {
    if (this.tableConfig?.displayedColumns) {
      this.displayedColumns = this.tableConfig.displayedColumns.map(
        (c) => c.columnDef
      );
    }
  }

  get coloumnType(): typeof ColumnType {
    return ColumnType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.tableDataSource) {
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
      this.createTableFilter();
    }
  }

  ngAfterViewInit() {
    if (this.tableDataSource) {
      this.displayedColumns = this.tableConfig.displayedColumns.map(
        (c) => c.columnDef
      );
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    }
  }

  getPropertyValue = (row: any, properyName: string) => {
    return _.get(row, properyName);
  };

  createTableFilter = () => {
    this.tableFilterSource = new Array<ITableFilter>();
    if (this.tableConfig?.displayedColumns?.length > 0) {
      this.tableConfig.displayedColumns.forEach((coloums) => {
        if (coloums.applyFilter) {
          let filter: ITableFilter = {
            filterName: coloums.header,
            dataSource: Array<string>(),
            fieldName: coloums.name,
          };
          if (filter.fieldName === 'balanceAmount') {
            filter.dataSource = this.pendingBalance;
          } else {
            filter.dataSource =
              this.getFilterDataSource(
                filter.fieldName,
                coloums.showUpperCase || false
              ) ?? new Array<string>();
          }
          this.tableFilterSource.push(filter);
        }
      });
    }
  };

  getFilterDataSource = (
    fieldName: string,
    showUpperCase: boolean
  ): Array<string> => {
    if (this.tableDataSource && this.tableDataSource?.data) {
      let dataSource = this.tableDataSource.data.map((x) => {
        return _.get(x, fieldName);
      });
      if (dataSource?.length > 0) {
        dataSource = dataSource.filter((x) => x && x !== '' && x !== ' ');
        if (showUpperCase) {
          dataSource = dataSource.map((x) => x.toUpperCase());
        }
        let distinctValues = dataSource?.filter((value, index) => {
          return dataSource.indexOf(value) == index;
        });
        return distinctValues?.sort((a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
      }
    }
    return [];
  };

  onApplyFilter = () => {
    if (this.tableFilterSource && this.tableFilterSource.length > 0) {
      let data: Array<string> = new Array<string>();
      _.forEach(this.tableFilterSource, (value) => {
        if (value && value.selectValue) {
          if (value.selectValue === Balance.PENDING) {
            data.push('');
          } else if (value.selectValue === Balance.COMPLETED) {
            data.push('0');
          } else {
            data.push(value.selectValue);
          }
        }
      });
      if (data && data.length > 0) {
        let filterString = data.join();
        this.tableDataSource.filter = filterString.trim().toLowerCase();
        if (this.tableDataSource.paginator) {
          this.tableDataSource.paginator.firstPage();
        }
      } else {
        let filterString = '';
        this.tableDataSource.filter = filterString.trim().toLowerCase();
        if (this.tableDataSource.paginator) {
          this.tableDataSource.paginator.firstPage();
        }
      }
    }
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  onSelectPro = (value: any) => {
    this.onSelectProfile.emit(value);
  }

}
