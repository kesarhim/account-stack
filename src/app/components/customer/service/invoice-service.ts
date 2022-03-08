import { InvoiceDetailDTO } from './../../client-account-ledger/account-ledger-model';
import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';

@Injectable({providedIn: 'root'})
export class InvoiceService {
  private baseURL: string = '/Invoice';
  constructor(private httpService : HttpService) {

  }

  public getTodayInvoices = () => {
    return this.httpService.get(`${this.baseURL}/get/today-invoices`);
  }

  public getInvoiceDetailsById = (invoiceId:number) => {
    return this.httpService.get(`${this.baseURL}/get?id=${invoiceId}`);
  }


  public saveInvoiceDetail = (invoiceDetail:InvoiceDetailDTO) => {
    return this.httpService.post(`${this.baseURL}/save`,invoiceDetail);
  }

  public deleteInvoices = (invoiceId:number) => {
    return this.httpService.post(`${this.baseURL}/delete/${invoiceId}`,null);
  }

}
