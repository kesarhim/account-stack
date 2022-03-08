import { Customer } from './../customer/create/models/customer-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-profile-details-component',
  templateUrl: './client-profile-detail-component.html',
  styleUrls:['./client-profile-detail-component.css']
})

export class ClientProfileDetailsComponent implements OnInit {
  @Input() customer:Customer;
  constructor() { }

  ngOnInit() { }

}
