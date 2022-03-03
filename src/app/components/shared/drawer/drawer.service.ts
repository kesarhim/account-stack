import { Subject } from 'rxjs';
import { EmbeddedViewRef, Injectable, TemplateRef, ElementRef } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DrawerService {

  public title:string;
  public opened = false;
  public icon:string;
  public template:TemplateRef<ElementRef> | null;
  public drawerSubject : Subject<boolean> = new Subject();

  constructor() { }

  openDrawer = (template:TemplateRef<ElementRef>,title:string,icon:string = '') => {
    this.title = title;
    this.opened = true;
    this.template = template;
    this.icon = icon;
    this.drawerSubject.next(true);
  }

  closeDrawer = () => {
    this.drawerSubject.next(false);
    this.resetValue();
  }

  resetValue = () => {
    this.opened = false;
    this.template = null;
    this.icon = '';
  }
}
