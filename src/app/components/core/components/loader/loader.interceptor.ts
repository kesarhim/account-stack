import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';



@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ((req.url.split('://')[0] === 'https') || (req.url.split('://')[0] === 'http')) {
      this.showLoader();
    }
    return next.handle(req).pipe(
      finalize(() => {
        if ((req.url.split('://')[0] === 'https') || (req.url.split('://')[0] === 'http')) {
          this.hideLoader()
        }
      })
    );
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
