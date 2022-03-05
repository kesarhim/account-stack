import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { OtherWorkDetail } from '../models/other-work-detail-model';

@Injectable({providedIn: 'root'})
export class OthweWorkDetailService {
  private baseControllerName: string = '/OtherWork';
  constructor(private httpService : HttpService) {

  }

  public getOtherWorkDetailsByCustomerId = (customerId:number) => {
    return this.httpService.get(`${this.baseControllerName}/get/${customerId}`);
  }

  public getOtherWorkDetailsById = (gstDetailId:number) => {
    return this.httpService.get(`${this.baseControllerName}/get?id=${gstDetailId}`);
  }

  public delelteOtherWorkDetails = (gstDetailId:number) => {
    return this.httpService.post(`${this.baseControllerName}/delete/${gstDetailId}`,null);
  }

  public getAllOtherWorkDetailList = (limitTo:number) => {
    return this.httpService.get(`${this.baseControllerName}/get/all?limitTo=${limitTo}`);
  }

  public saveOtherWorkDetail = (otherWorkDetail : OtherWorkDetail) => {
    return this.httpService.post(`${this.baseControllerName}/save`,otherWorkDetail);
  }


}
