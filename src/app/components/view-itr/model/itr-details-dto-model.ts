import { CatalogData } from './../../shared/catalog-loader/models/catalog.model';
export class ITRDetailsDTO {
  id :number;
  year : CatalogData;
  customerId :number;
  taxAmount :number;
  ackNo  :string;
  feesPaid :number;
  refundAmount:number;
  fileDate :Date;
  totalFees :number;
  remark:string;
  doneBy:string;
  fullName:string;
  panNo:string;
  invoiceId:number;
  balanceAmount:number;
  receivedPaymentId:number;
}
