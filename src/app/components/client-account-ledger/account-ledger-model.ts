import { ReceivePaymentDTO } from "../payment/models/receive-payment-dto";

export class AccountLedgerDTO {
    invoices : Array<InvoiceDetailDTO>;
    paymentHistory : Array<ReceivePaymentDTO>;
}


export class InvoiceDetailDTO {
    invoiceId :number;
    customerid :number;
    invoiceDate :Date;
    invoiceAmount :number;
    status :number;
    editor :string;
    editingdate :Date;
    contextKey :number;
    contextType :string;
}
