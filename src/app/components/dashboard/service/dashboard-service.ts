import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { PendingPaymentRequest } from "../../payment/models/payment.model";

@Injectable({providedIn: 'root'})
export class DashboardService {
  private baseURL: string = '/Dashboard';
  constructor(private httpService : HttpService) {

  }

  public getPendingPayment = (paymentDeails:PendingPaymentRequest) => {
    return this.httpService.post(`${this.baseURL}/pending-payment`,paymentDeails);
  }

  public getTotalReceivedPayments = () => {
    return this.httpService.get(`${this.baseURL}/received-payments`);
  }

  public getTotalDiscountOffered = () => {
    return this.httpService.get(`${this.baseURL}/total-discount-offered`);
  }

  public getTodayReceivedPayments = () => {
    return this.httpService.get(`${this.baseURL}/today-received-payments`);
  }

  public getTodayPendingPayments = () => {
    return this.httpService.get(`${this.baseURL}/today-pending-payment`);
  }

  public getTotalActiveClients = () => {
    return this.httpService.get(`${this.baseURL}/total-client`);
  }

  public getTotalBill = () => {
    return this.httpService.get(`${this.baseURL}/total-bill`);
  }

  public getPaymentDetails = (paymentId:number) => {
    return this.httpService.get(`${this.baseURL}/get?id=${paymentId}`);
  }

  public deletePaymentDetails = (paymentId:number) => {
    return this.httpService.post(`${this.baseURL}/delete/${paymentId}`,null);
  }

}
