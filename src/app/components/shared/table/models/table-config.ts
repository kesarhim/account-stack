export interface ITableConfig {
  displayedColumns : Array<ITableColumn>;
}

export interface ITableColumn {
  columnDef: string,
  header: string,
  cell?: Function,
  name:string,
  type?: ColumnType,
  actions? :Array<ITableActionLinks>;
  showUpperCase?:boolean;
  applyFilter?:boolean;
}

export interface ITableActionLinks{
   linkName : string;
   icon: string;
   method:Function;
   showIcon:boolean;
}

export interface ITableFilter {
   filterName:string;
   dataSource:Array<any>;
   selectValue?:any;
   fieldName:string;
}

export enum ColumnType {
  SECONDARY,
  PRIMARY,
  DATE
}
