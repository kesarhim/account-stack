import { HttpService } from './../../core/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ITRDetailService {
  private baseURL: string = '/ITRDetail';
  constructor(private httpService : HttpService) {

   }

  public getITRDetailsByCustomerId = (customerId:number) => {
    return this.httpService.get(`${this.baseURL}/get/${customerId}`);
  }

   public getITRDetailsById = (itrDetailId:number) => {
    return this.httpService.get(`${this.baseURL}/get?id=${itrDetailId}`);
  }

  public delelteITR = (itrDetailId:number) => {
    return this.httpService.post(`${this.baseURL}/delete/${itrDetailId}`,null);
  }
}
