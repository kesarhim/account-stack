import { UserCred } from '../../shared/models/user-cred.model';
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StorageKeys, StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { mergeMap, tap } from 'rxjs/operators';
import { LoaderService } from '../components/loader/loader.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private _storageService: StorageService, private _loader: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method} = request;
    const tokenValue: {token:string} = this._storageService.get(StorageKeys.TOKEN);
    const authHeader = `Bearer ${tokenValue?.token}`;
    let authReq = undefined;
    return of(null)
      .pipe(mergeMap(() => handleIncomingRequest(this)))

    function handleIncomingRequest(scope:any): Observable<HttpEvent<any>> {
      switch (true) {
        case url.endsWith('/login') && method === 'POST':
          return login();
        default: {
          authReq = request.clone({
            headers: request.headers.set('Authorization', authHeader)
          });
          return next.handle(authReq).pipe(
            tap((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
              }
            }, (err: any) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 0) {
                  scope._loader.hide();
                  scope._storageService.clear();
                  scope.router.navigate(['/login']);
                }
              }
            }));

        }
      }
    }

    function login(): Observable<HttpEvent<any>> {
      return next.handle(request);
    }
  }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = this._storageService.get(UserDataObj[0]);
  //   const authHeader = `Bearer ${token}`;
  //   let authReq= undefined;
  //   if(req.url.includes(`s3.amazonaws.com`)){
  //      authReq = req.clone({
  //     });
  //   }else{
  //      authReq = req.clone({
  //       headers: req.headers.set('Authorization', authHeader)
  //     });
  //   }


  //   return next.handle(authReq).pipe(
  //     tap((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {
  //       }
  //     }, (err: any) => {
  //       if (err instanceof HttpErrorResponse) {
  //         if (err.status === 401) {
  //           this._loader.hide();
  //           this._storageService.clear();
  //           this.router.navigate(['/auth/login']);
  //         }
  //       }
  //     }));
  //}
}
