import { ReceivePaymentComponent } from './components/payment/add-payment/receive-payment-component';
import { AddOtherWorkComponent } from './components/other-work/add-other-work/add-other-work-component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderComponent } from './components/core/components/loader/loader.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CardComponent } from './components/shared/service/utility/card/card-component';
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import { CarouselComponent } from './components/shared/service/utility/carousel/carousel-component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header-component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HomeComponent } from './components/home/home-component';
import { CustomerPaymentHistoryComponent } from './components/payment/customer-payment-history/customer-payment-history-component';
import { CustomersPaymentsComponent } from './components/customer/customers-view/customers-view-all-component';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { CreateCustomerComponent } from './components/customer/create/create-customer-component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CustomerAddITRComponent } from './components/customer/add-itr/customer-add-itr-component';
import { DashboardComponent } from './components/dashboard/dashboard-component';
import { LoginComponent } from './components/login/login-component';
import { CustomerAddPasswordComponent } from './components/customer/add--password/customer-add-password';
import { CustomerAddGSTComponent } from './components/add-gst/customer-add-gst-component';
import { SearchComponent } from './components/search/search-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AlertComponent } from './components/core/components/alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './components/core/interceptors/auth.interceptor';
import { AddUserComponent } from './components/user/add-user-component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './components/customer/customer-list/customer-list-component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TableComponentComponent } from './components/shared/table/table-component';
import { DrawerComponent } from './components/shared/drawer/drawer-component';
import {MatSortModule} from '@angular/material/sort';
import { ViewITRFilledComponent } from './components/view-itr/view-itr-filled-component';
import { CatalogLoaderComponent } from './components/shared/catalog-loader/catalog-loader-component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './components/shared/dialog/dialog-component';
import { GstListComponent } from './components/view-all-gst/view-gst-list-component';
import { ViewOtherWorkListComponent } from './components/other-work/view-other-work-list/view-other-work-list-component';
import { DatePickerComponent } from './components/shared/date-picker/date-picker-component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardComponent,
    HeaderComponent,
    LoginComponent,
    CarouselComponent,
    CustomerPaymentHistoryComponent,
    CustomersPaymentsComponent,
    CreateCustomerComponent,
    CustomerAddITRComponent,
    DashboardComponent,
    CustomerAddPasswordComponent,
    CustomerAddGSTComponent,
    SearchComponent,
    AlertComponent,
    LoaderComponent,
    AddUserComponent,
    CustomerListComponent,
    TableComponentComponent,
    DrawerComponent,
    ViewITRFilledComponent,
    CatalogLoaderComponent,
    DialogComponent,
    GstListComponent,
    ViewOtherWorkListComponent,
    AddOtherWorkComponent,
    ReceivePaymentComponent,
    DatePickerComponent,
    ClientProfileComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSliderModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    NgbModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
