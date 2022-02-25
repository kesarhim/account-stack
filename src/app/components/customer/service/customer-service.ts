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

}
