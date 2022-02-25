import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Inject, Injectable } from '@angular/core';

import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl: string;

  constructor(private http: HttpClient) {
      this.baseUrl = environment.API_ENDPOINT;
  }

  // constructor(private http: HttpClient, private ConfigurationLoader: ConfigurationLoader) {
  //   if (environment.demoMode) {
  //     this.baseUrl = ConfigurationLoader?.getConfiguration()?.API_ENDPOINT || environment.API_ENDPOINT;
  //   }
  // }

  get(endpoint:string, baseurl?:string, options?: object) {
      return this.http.get(this.baseUrl + endpoint);
  }

  downloadBlob(endpoint:string, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
      return this.http.get(this.baseUrl + endpoint, { responseType: 'blob', observe: 'response' });
    } else {
      return of(null);
    }
  }

  downloadPostBlob(endpoint:string, data:string, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
      return this.http.post(this.baseUrl + endpoint, data, { responseType: 'blob' });
    } else {
      return of(null);
    }
  }

  uploadPostBlob(endpoint:string, data:string ) {
    if (endpoint) {
      return this.http.post(endpoint, data, { reportProgress: true,
        observe: 'events' });
    } else {
      return of(null);
    }
  }

  getMock(url:string) {
    return this.http.get(url);
  }

  post(endpoint:string, data:any, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
    }
   // let header = new HttpHeaders({'access-control-allow-origin' : '*'})
    return this.http.post(this.baseUrl + endpoint, data);
  }

  patch(endpoint:string, data:string, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
      return this.http.patch(this.baseUrl + endpoint, data);
    } else {
      return of(null);
    }
  }

  put(endpoint:string, data?:string, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
      return this.http.put(this.baseUrl + endpoint, data);
    } else {
      return of(null);
    }
  }

  delete(endpoint:string, options?:Array<any>, baseurl?:string) {
    if (endpoint) {
      if (baseurl) {
        this.baseUrl = baseurl;
      }
      const params: any = {};
      if (options) {
        for (const key in options) {
          if (options.hasOwnProperty(key)) {
            if (options[key]) {
              params[key] = options[key];
            }
          }
        }
      }
      return this.http.delete(this.baseUrl + endpoint, {params});
    } else {
      return of(null);
    }
  }



  getLocal(endpoint:string) {
    if (endpoint) {
      return this.http.get(endpoint);
    } else {
      return of(null);
    }
  }

}
