export class PaymentDetails {
  clientName: string;
  invoiceId: number;
  customerId: number;
  contextKey: string;
  totalFees: number;
  balanceAmount: number;
  feesPaid: number;
  discountOffered:number;
  panNo: string;
  isOtherWork: boolean;
  workDetails: string;
  id:number;
  receivedMethod :string;
  receivedBy :string;
  receivedAmount :number;
  receivedDate: Date;
  chequeNo :string;
  transactionNo :string;
  remark:string;
  discount:number;
}


export class PendingPaymentRequest {
  customerId: number;
  startDate: Date;
  endDate: Date;
  fetchTotal: boolean;
  fetchToday: boolean;
}
