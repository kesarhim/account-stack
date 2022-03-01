import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { DrawerService } from './drawer.service';

@Component({
  selector: 'app-drawer-component',
  templateUrl: './drawer-component.html',
  styleUrls: ['./drawer-component.css']

})

export class DrawerComponent implements OnInit {

  @Input() opened: boolean;
  public headerTitle: string = '';
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('drawer') drawer: MatDrawer;
  public template : TemplateRef<any> | null;
  constructor(private renderer: Renderer2, private el: ElementRef,private drawerService: DrawerService) { }


  onCloseBtnClick = () => {
    //  alert('called')
    this.opened = false;
    this.drawer.opened = false;
    this.drawer.close();
    this.onClose.emit();
  }
  ngOnInit() {


  }

  ngAfterViewInit(): void {
    this.drawer.closedStart.subscribe((value) => {
      this.renderer.removeClass(this.el.nativeElement.firstChild, 'apply-backdrop')
      this.onClose.emit();
      this.onCloseBtnClick();
    });

    this.drawer.openedStart.subscribe((value) => {
      this.renderer.addClass(this.el.nativeElement.firstChild, 'apply-backdrop')
    });

    this.drawerService.drawerSubject.subscribe(value => {
      this.opened = value;
      this.headerTitle = this.drawerService.title;
       if(value){
         this.template = this.drawerService.template;
       }else{
         this.onCloseBtnClick();
       }
    })
  }
}
