import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnType, ITableConfig } from './models/table-config';
import * as _ from 'lodash';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.html',
  styleUrls:['./table-component.css']
})

export class TableComponentComponent implements OnInit {

  @Input() tableDataSource: MatTableDataSource<any>;
  @Input() tableConfig : ITableConfig;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns : Array<string>;
  constructor() { }

  ngOnInit() {
    if(this.tableConfig?.displayedColumns){
      this.displayedColumns = this.tableConfig.displayedColumns.map(c => c.columnDef);
    }
  }

  get coloumnType(): typeof ColumnType {
    return ColumnType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.tableDataSource){
      this.tableDataSource.paginator = this.paginator;
     this.tableDataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    if(this.tableDataSource){
      this.displayedColumns = this.tableConfig.displayedColumns.map(c => c.columnDef);
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    }
  }

  getPropertyValue = (row:any,properyName:string) => {
    return _.get(row,properyName);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }
}
