import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AlertComponent } from './components/alert/alert.component';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { LoaderComponent } from './components/loader/loader.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NewSharedModule } from '../new-shared/new-shared.module';
@NgModule({
  imports: [HttpClientModule, CommonModule, NgxStickySidebarModule, NewSharedModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
    })],
  declarations: [AlertComponent, LoaderComponent],
  providers: [ /* DataService, ClonerService, EventBusService, HttpClientRxJSService, */
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
    // }
  ],
  exports: [AlertComponent, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Core is already loaded. Import it in the AppModule only');
    }
  }

}
