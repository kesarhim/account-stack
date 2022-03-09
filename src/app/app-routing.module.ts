import { TodayReceivedPayments } from './components/today-received-payment/today-received-payment-component';
import { TodayAccountSummaryComponent } from './components/account-summary/today-acccount-summary-component';
import { ReceivePaymentComponent } from './components/payment/add-payment/receive-payment-component';
import { ViewOtherWorkListComponent } from './components/other-work/view-other-work-list/view-other-work-list-component';
import { AddOtherWorkComponent } from './components/other-work/add-other-work/add-other-work-component';
import { GstListComponent } from './components/view-all-gst/view-gst-list-component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list-component';
import { AddUserComponent } from './components/user/add-user-component';
import { AuthGuard } from './components/core/components/helper/auth.guard';
import { SearchComponent } from './components/search/search-component';
import { CustomerAddGSTComponent } from './components/add-gst/customer-add-gst-component';
import { CustomerAddPasswordComponent } from './components/customer/add--password/customer-add-password';
import { LoginComponent } from './components/login/login-component';
import { DashboardComponent } from './components/dashboard/dashboard-component';
import { CustomerPaymentHistoryComponent } from './components/payment/customer-payment-history/customer-payment-history-component';
import { CreateCustomerComponent } from './components/customer/create/create-customer-component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home-component';
import { CustomerAddITRComponent } from './components/customer/add-itr/customer-add-itr-component';
import { ViewITRFilledComponent } from './components/view-itr/view-itr-filled-component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { TotalPendingPaymentComponent } from './components/total-pending-payments/total-pending-payments-component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, canActivate :[AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customer/create', component: CreateCustomerComponent },
      { path: 'customer/payment/history', component: CustomerPaymentHistoryComponent },
      { path: 'customer/add/itr', component: CustomerAddITRComponent },
      { path: 'dashboard', component: DashboardComponent },
      {path:'customer/add/password', component:CustomerAddPasswordComponent},
      {path:'customer/add/gst', component:CustomerAddGSTComponent},
      {path:'customer/search',component:SearchComponent},
      {path:'add/user',component: AddUserComponent},
      { path: 'customer/all', component: CustomerListComponent },
      {path:'viewItr',component: ViewITRFilledComponent},
      {path:'gst-list',component: GstListComponent},
      {path:'add/other-work',component: AddOtherWorkComponent},
      {path:'other-work-list',component: ViewOtherWorkListComponent},
      {path:'receive-payment',component: ReceivePaymentComponent},
      {path:'client-profile',component: ClientProfileComponent},
      {path:'account-summary',component: TodayAccountSummaryComponent},
      {path:'today-received-payments',component:TodayReceivedPayments},
      {path:'total-pending-payments',component:TotalPendingPaymentComponent},
      {path:'create-invoice',component:CreateInvoiceComponent}
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
