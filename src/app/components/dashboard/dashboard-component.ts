import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.html',
  styleUrls:['./dashboard-component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() { }

  onSelectCard=():void => {
    this.router.navigateByUrl('/home/add/user');
  }
}
