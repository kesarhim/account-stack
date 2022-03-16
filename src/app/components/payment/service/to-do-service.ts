import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { Ticket } from "../../customer/models/to-do-model";




@Injectable({providedIn: 'root'})
export class TicketDetailService {
  private baseURL: string = '/Ticket';
  constructor(private httpService : HttpService) {

  }

    public creatTicket = (tickDeails: Ticket) => {
    return this.httpService.post(`${this.baseURL}/save`,tickDeails);
  }
}





