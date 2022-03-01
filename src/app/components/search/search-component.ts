import { Customer } from './../customer/create/models/customer-model';
import { HttpService } from './../core/services/http.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { debounce, debounceTime } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatSelectionList } from '@angular/material/list';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.html',
  styleUrls:['./search-component.css']
})

export class SearchComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  public customers:Array<Customer>;
  public showOptions:boolean = false;
  private openSubs:Subscription;
  @Output() onSelectClient:EventEmitter<Customer> = new EventEmitter();
  @ViewChild('selectClient') matSelect :any;
  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

  searchText = '';
  searchClients = () => {
    if(this.searchText && this.searchText != ''){
      let url = `/customer/search?searchString=${this.searchText}`
      this.httpService.get(url).subscribe((result :any) => {
          if(result?.response){
            this.customers = result.response;
            this.showOptions = true;
            this.customers.push(...result.response);
          }
      });
    }
  }

  onClose = () =>{
    this.showOptions = false;
  }

  onSelectMember(customer:Customer){
    this.showOptions = false;
    if(customer){
       this.onSelectClient.emit(customer);
    }
  }

}
