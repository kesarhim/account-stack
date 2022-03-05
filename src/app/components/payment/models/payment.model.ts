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
}


export class PendingPaymentRequest {
  customerId: number;
  startDate: Date;
  endDate: Date;
  fetchTotal: boolean;
  fetchToday: boolean;
}
