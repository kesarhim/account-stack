import { HttpService } from './../../core/services/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class CustomerService {
  private baseURL :string = '/Customer';
  constructor(private httpService : HttpService) {

   }

   public getCustomersDetailsByContext = (contextKey:string) => {
    return this.httpService.get(`${this.baseURL}/get/customers/context?contextKey=${contextKey}`);
  }

   public getCustomerDetailsById = (customerId:number) => {
     return this.httpService.get(`${this.baseURL}/get?customerId=${customerId}`);
   }

   public getCustomersByIds = (customerIds:Array<number>) => {
    return this.httpService.post(`${this.baseURL}/get/customers`,customerIds);
  }

   public getCustomerAccountLedger = (customerId:number) => {
    return this.httpService.get(`${this.baseURL}/get/ledger/${customerId}`);
  }

}
