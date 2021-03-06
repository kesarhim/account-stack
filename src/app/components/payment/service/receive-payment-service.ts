import { ReceivePaymentDTO } from './../models/receive-payment-dto';
import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";

@Injectable({providedIn: 'root'})
export class ReceivePaymentService {
  private baseURL: string = '/ReceivePayment';
  constructor(private httpService : HttpService) {

  }

  public getReceiveDetailsByCustomerId = (customerId:number) => {
    return this.httpService.get(`${this.baseURL}/get/${customerId}`);
  }

  public getReceiveDetailsByInvoiceId = (invoiceId:number) => {
    return this.httpService.get(`${this.baseURL}/get/invoice/${invoiceId}`);
  }

  public savePaymentDetails = (paymentDeails:ReceivePaymentDTO) => {
    return this.httpService.post(`${this.baseURL}/save`,paymentDeails);
  }

  public getTodayPaymentDetails = () => {
    return this.httpService.get(`${this.baseURL}/get/today-received-payments`);
  }

  public getPaymentDetails = (paymentId:number) => {
    return this.httpService.get(`${this.baseURL}/get?id=${paymentId}`);
  }

  public deletePaymentDetails = (paymentId:number) => {
    return this.httpService.post(`${this.baseURL}/delete/${paymentId}`,null);
  }

}
