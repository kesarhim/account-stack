import { DrawerService } from './../../shared/drawer/drawer.service';
import { LoaderService } from './../../core/components/loader/loader.service';
import { AlertService } from './../../core/components/alert/alert.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentDetails } from '../models/payment.model';
import { ReceivePaymentService } from '../service/receive-payment-service';
import { ReceivePaymentDTO } from '../models/receive-payment-dto';
import { User } from '../../shared/models/user-cred.model';
import { StorageKeys, StorageService } from '../../core/services/storage.service';
import { Customer } from '../../customer/create/models/customer-model';

@Component({
  selector: 'app-receive-payment-component',
  templateUrl: './receive-payment-component.html',
  styleUrls: ['./receive-payment-component.css']

})

export class ReceivePaymentComponent implements OnInit {

  public receivePaymentForm: FormGroup;
  private loggedInUser: User;
  @Input() paymentDetails: PaymentDetails;
  @Input() showTitle: boolean = false;
  private isEditMode :boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private receivePaymentService: ReceivePaymentService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private storageService:StorageService,
    private drawerService: DrawerService
  ) {
    this.creatForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && this.paymentDetails){
      this.receivePaymentForm.patchValue({
        amount:this.paymentDetails.balanceAmount

      });
      if(this.paymentDetails.id > 0){
        this.isEditMode = true;
        this.receivePaymentForm.patchValue({
          paymentMethod: this.paymentDetails.receivedMethod,
          cheuqeNumber: this.paymentDetails.chequeNo,
          transactionNumber: this.paymentDetails.transactionNo,
          discount:this.paymentDetails.discount,
          receivedBy: this.paymentDetails.receivedBy,
          date: new Date(this.paymentDetails.receivedDate),
          remark: this.paymentDetails.remark
        });
      }
    }



  }
  ngOnInit() {
    this.loggedInUser = this.storageService.get(StorageKeys.CURRENT_USER);
    if(this.loggedInUser){
      this.receivePaymentForm.patchValue({
        receivedBy : this.loggedInUser.username
      })
    }
  }

  creatForm = () => {
    this.receivePaymentForm = this.formBuilder.group({
      amount: [null, Validators.required],
      paymentMethod: ['CASH', Validators.required],
      cheuqeNumber: [null],
      transactionNumber: [null],
      discount:[null],
      receivedBy: [null, Validators.required],
      date: [new Date(), Validators.required],
      remark: [null]
    });
  }

  validatePayment = ():boolean => {
     const amount = this.receivePaymentForm.get('amount')?.value;
     const discount = this.receivePaymentForm.get('discount')?.value;
     let total:number = amount + discount;
     if(this.paymentDetails.balanceAmount >= total){
      return true
     }else {
       this.alertService.error("Amount can not be greater than balance amount.")
     }
     return false;
  }

  onSavePaymentDetails = () => {
    if (this.receivePaymentForm.valid && this.validatePayment()) {
      let payload: ReceivePaymentDTO = this.getPayLoad();
      if (payload.invoiceId > 0 || payload.customerid > 0) {
        if (payload.receivedAmount > 0) {
          this.loaderService.show();
          this.receivePaymentService.savePaymentDetails(payload).subscribe(sucess => {
            this.loaderService.hide();
            this.receivePaymentForm.reset();
            this.drawerService.closeDrawer();
            this.alertService.success("Payment has been updated successfully.");
          },err => {
            this.alertService.error(err?.error?.message);
            this.loaderService.hide();
          });
        } else {
          this.alertService.error("Amount can not be Zero")
        }
      } else {
        this.alertService.error("Invoice / Client details not found");
      }

    } else {
      this.alertService.error("Please enter all mandatory details.")
    }
  }

  private getPayLoad = (): ReceivePaymentDTO => {
    let receivePaymentDTO: ReceivePaymentDTO = new ReceivePaymentDTO();
    if (this.paymentDetails) {
      receivePaymentDTO.invoiceId = this.paymentDetails.invoiceId;
      receivePaymentDTO.customerid = this.paymentDetails.customerId;
      receivePaymentDTO.panNo = this.paymentDetails.panNo;
      receivePaymentDTO.chequeNo = this.receivePaymentForm.get('cheuqeNumber')?.value;
      receivePaymentDTO.transactionNo = this.receivePaymentForm.get('transactionNumber')?.value;
      receivePaymentDTO.receivedDate = this.receivePaymentForm.get('date')?.value;
      receivePaymentDTO.remark = this.receivePaymentForm.get('remark')?.value;
      receivePaymentDTO.receivedBy = this.receivePaymentForm.get('receivedBy')?.value;
      receivePaymentDTO.receivedMethod = this.receivePaymentForm.get('paymentMethod')?.value;
      receivePaymentDTO.receivedAmount = this.receivePaymentForm.get('amount')?.value;
      receivePaymentDTO.discountOffered = this.receivePaymentForm.get('discount')?.value;
    }
    return receivePaymentDTO;
  }

}
