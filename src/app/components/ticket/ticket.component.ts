import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../core/components/alert/alert.service';
import { LoaderService } from '../core/components/loader/loader.service';
import { UserService } from '../core/services/user.service';
import { Customer } from '../customer/create/models/customer-model';
import { TicketDetailService } from '../payment/service/to-do-service';
import { GSTDetailsDTO } from '../view-all-gst/model/gst-details-dto';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  public todoTaskForm : FormGroup;
  public selectedCustomer: Customer | null;


  constructor(private userService: UserService,

    private formBuilder: FormBuilder)
    { }

  ngOnInit() {
    this.createForm()
  }


  createForm = () => {
    this.todoTaskForm = this.formBuilder.group({
      clientName: [null, [Validators.required]],
      taskTitle: [null, [Validators.required]],
      assignMember: [null, [Validators.required]],
      taskFees:[null ],
      taskDescription:[null ],
      status:[null,[Validators.required] ],
    });
  }
  onSavetask = () =>{
    if(this.todoTaskForm.valid )
    {
      let payload: TicketDetailService = this.getPayload();
    }




  }

  onSelectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    this.todoTaskForm?.patchValue({
      clientName: this.selectedCustomer?.fullName,
      panNumber: this.selectedCustomer?.panNo,
      aadhaarNumber: this.selectedCustomer?.aadhaarNo,
    });
  }


}
