import { AlertService } from './../../../../core/components/alert/alert.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-component',
  templateUrl: './card-component.html',
  styleUrls:['./card-component.css']
})

export class CardComponent implements OnInit {
  constructor(private alertService:AlertService) { }

  @Input() title :string;
  @Input() subTitle:string;


  ngOnInit() { }

  actionPerfomed =() =>{
    alert('dadadada');
     this.alertService.info('TDAaaaaaaaaaaaaaa');
  }
}
