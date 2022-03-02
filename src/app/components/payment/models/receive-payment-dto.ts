import { CatalogData } from './../../shared/catalog-loader/models/catalog.model';
export class ReceivePaymentDTO {
  id :number;
  customerid :number;
  receivedMethod :string;
  receivedBy :string;
  receivedAmount :number;
  receivedDate: Date;
  chequeNo :string;
  transactionNo :string;
  invoiceId:number;
  discountOffered :number;
  remark :string;
  receivedMethodCat :CatalogData;
  panNo:string;
}
