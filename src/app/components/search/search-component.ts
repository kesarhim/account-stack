import { Customer } from './../customer/create/models/customer-model';
import { HttpService } from './../core/services/http.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.html',
  styleUrls:['./search-component.css']
})

export class SearchComponent implements OnInit {
  constructor(private httpService: HttpService) { }
  public customers:Array<Customer>;
  public showOptions:boolean = false;
  @Output() onSelectClient:EventEmitter<Customer> = new EventEmitter();
  ngOnInit() { }

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

  onSelectMember(customer:Customer){
    this.showOptions = false;
    if(customer){
       this.onSelectClient.emit(customer);
    }
  }

}
