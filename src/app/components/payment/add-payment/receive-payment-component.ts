import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-receive-payment-component',
  templateUrl: './receive-payment-component.html',
  styleUrls:['./receive-payment-component.css']

})

export class ReceivePaymentComponent implements OnInit {

  constructor(
   private formBuilder :FormBuilder,
  ) { }

  public receivePaymentForm : FormGroup;
  ngOnInit() {
    this.creatForm();
  }


creatForm = () =>{
  this.receivePaymentForm= this.formBuilder.group({

   amount:[null,Validators.required],
   paymentMethod:[null,Validators.required],
   cheuqeNumber:[null,Validators.required],
   transactionNumber:[null],
   receivedBy:[null,Validators.required],
   date:[null,Validators.required],
   remark:[null]


  });
  }

  onSavePaymentDetails=()=>
  {

  }
}
