import { CatalogData } from './../../shared/catalog-loader/models/catalog.model';
export class GSTDetailsDTO{

  gstNumber: string;
  gstTypeCode:CatalogData;
  fileDate:Date;
  yearCode:CatalogData;
  monthCode:CatalogData;
  totalfees:number;
  feespaid:number;
  remark:string;
  customerId:number;
  doneBy:string;
  id :number;
  fullName:string;
  panNo:string;
  invoiceId:number;
  balanceAmount:number;
  receivedPaymentId:number;
}


