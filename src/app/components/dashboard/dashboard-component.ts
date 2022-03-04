import { DashboardService } from './service/dashboard-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PendingPaymentRequest } from '../payment/models/payment.model';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private router: Router, private dashboardService: DashboardService) { }

  public totalPendingPayment: number;
  public todayReceivedPayment:number;
  public totalReceivedPayment:number;
  public todayPendingPayments:number;
  public totalActiveClients:number;

  public showLoader:boolean = false;

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard = () => {
    this.getTodayReceivedPayment();
    this.getTotalPendingPayment();
    this.getTotalReceivedPayment();
    this.getTodayPendingPayments();
    this.getTotalActiveClients();
  }

  getTotalPendingPayment = () => {
    this.showLoader = true;
    this.dashboardService.getPendingPayment(new PendingPaymentRequest()).subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.totalPendingPayment = result.response;
          this.showLoader = false;
        },2000)
      }
    });
  }

  getTodayReceivedPayment = () => {
    this.dashboardService.getTodayReceivedPayments().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.todayReceivedPayment = result.response;
          this.showLoader = false;
        },2000)
      }
    })
  }

  getTotalReceivedPayment = () => {
    this.dashboardService.getTotalReceivedPayments().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.totalReceivedPayment = result.response;
          this.showLoader = false;
        },2000)
      }
    })
  }

  getTodayPendingPayments = () => {
    this.dashboardService.getTodayPendingPayments().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.todayPendingPayments = result.response;
          this.showLoader = false;
        },2000)
      }
    })
  }


  getTotalActiveClients = () => {
    this.dashboardService.getTotalActiveClients().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.totalActiveClients = result.response;
          this.showLoader = false;
        },2000)
      }
    })
  }

  onSelectCard = (): void => {
    this.router.navigateByUrl('/home/add/user');
  }


}
