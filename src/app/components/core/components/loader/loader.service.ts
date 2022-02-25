import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Loader } from './loader.model';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<Loader>();
  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show(message = 'Loading, please wait') {
    this.loaderSubject.next(<Loader>{ show: true, message: message });
  }
  hide() {
    this.loaderSubject.next(<Loader>{ show: false });
  }

  timer(timer = 2000) {
    this.loaderSubject.next(<Loader>{ show: true, timer });
  }
}
