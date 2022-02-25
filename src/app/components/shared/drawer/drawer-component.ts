import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drawer-component',
  templateUrl: './drawer-component.html',
  styleUrls:['./drawer-component.css']

})

export class DrawerComponent implements OnInit {

  @Input() opened: boolean;
  @Input() headerTitle:string = '';
  @Output() onClose:EventEmitter<any> = new EventEmitter();

  @ViewChild('drawer') drawer : MatDrawer;
  constructor() { }


  onCloseBtnClick =() => {
  //  alert('called')
    this.opened = false;
    this.drawer.opened = false;
     this.drawer.close();
     this.onClose.emit();
  }
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.drawer.closedStart.subscribe((value)=>{
      this.onClose.emit();
     });
  }
}
