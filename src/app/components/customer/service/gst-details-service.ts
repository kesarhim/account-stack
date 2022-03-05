import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';

@Injectable({providedIn: 'root'})
export class GSTDetailService {
  private baseURL: string = '/GSTDetail';
  constructor(private httpService : HttpService) {

  }

  public getGstDetailsByCustomerId = (customerId:number) => {
    return this.httpService.get(`${this.baseURL}/get/${customerId}`);
  }

  public getGstDetailsById = (gstDetailId:number) => {
    return this.httpService.get(`${this.baseURL}/get?id=${gstDetailId}`);
  }

  public delelteGstDetails = (gstDetailId:number) => {
    return this.httpService.post(`${this.baseURL}/delete/${gstDetailId}`,null);
  }

}
