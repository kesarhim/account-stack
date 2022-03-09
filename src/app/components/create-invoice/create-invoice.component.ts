import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceDetailDTO } from '../client-account-ledger/account-ledger-model';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { StorageKeys, StorageService } from '../core/services/storage.service';
import { UserService } from '../core/services/user.service';
import { InvoiceService } from '../customer/service/invoice-service';
import { DrawerService } from '../shared/drawer/drawer.service';
import { User } from '../shared/models/user-cred.model';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css'],
})
export class CreateInvoiceComponent implements OnInit {
  @Input() customerId: number;

  private loggedInUser: User;
  public InvoiceForm: FormGroup;
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private invoiceservice: InvoiceService,
    private drawerService:DrawerService,
    private storageService:StorageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loggedInUser = this.storageService.get(StorageKeys.CURRENT_USER);
    if(this.loggedInUser){
      this.InvoiceForm.patchValue({
        createBy : this.loggedInUser.username
      })
    }
  }

  createForm = () => {
    this.InvoiceForm = this.formBuilder.group({
      workType: [null, Validators.required],
      date: [new Date(), Validators.required],
      totalFees: [null, Validators.required],
      createBy: [null, Validators.required],
      remark: [null],
    });
  };

  onSave() {
    if (this.InvoiceForm.valid && this.customerId > 0) {
      this.loaderService.show();
      let payload: InvoiceDetailDTO = new InvoiceDetailDTO();
      payload.invoiceDate = this.InvoiceForm.get('date')?.value;
      payload.invoiceAmount = this.InvoiceForm.get('totalFees')?.value;
      payload.contextType = this.InvoiceForm.get('workType')?.value;
      payload.creator = this.InvoiceForm.get('createBy')?.value;
      payload.customerid = this.customerId;

      this.invoiceservice
        .saveInvoiceDetail(payload)
        .subscribe((result: any) => {
          this.loaderService.hide();
          this.drawerService.closeDrawer();
          if (result && result.response) {
            this.alertService.success('Invoice created successfully');
            this.InvoiceForm.reset();
          }

        },
        err => this.loaderService.hide()

        );

    } else {
      this.alertService.error('Please fill the all mandotry fileds');
    }
  }
}
