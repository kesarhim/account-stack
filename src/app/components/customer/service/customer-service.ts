import { HttpService } from './../../core/services/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class CustomerService {
  private baseURL :string = '/Customer';
  constructor(private httpService : HttpService) {

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
