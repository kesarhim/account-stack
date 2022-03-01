import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-receive-payment-component',
  templateUrl: './receive-payment-component.html',
  styleUrls:['./receive-payment-component.css']

})

export class ReceivePaymentComponent implements OnInit {

  @Input() showTitle : boolean = false;
  constructor(
   private formBuilder :FormBuilder,
  ) {
    this.creatForm();
   }

  public receivePaymentForm : FormGroup;
  ngOnInit() {

  }


creatForm = () =>{
  this.receivePaymentForm= this.formBuilder.group({
   amount:[null,Validators.required],
   paymentMethod:['CASH',Validators.required],
   cheuqeNumber:[null],
   transactionNumber:[null],
   receivedBy:[null,Validators.required],
   date:[new Date(),Validators.required],
   remark:[null]
  });
  }

  onSavePaymentDetails=()=> {

  }
}
