import { CatalogData } from './models/catalog.model';
import { HttpService } from './../../core/services/http.service';
import { Component, OnInit, Input, SimpleChanges, forwardRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-catalog-loader-component',
  templateUrl: './catalog-loader-component.html',
  styleUrls: ['./catalog-loader-component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CatalogLoaderComponent)
    }
  ]
})

export class CatalogLoaderComponent implements ControlValueAccessor {

  @Input() catId: string;
  @Input() placeHolder: string;
  @Output() onChangeSelection: EventEmitter<CatalogData> = new EventEmitter();
  _value: CatalogData;
  public catalogData: Array<CatalogData>;
  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private onTouchedCallback = () => { }
  private onChangeCallback = (value: any) => { };

  /**
   *
   */
  constructor(private httpService: HttpService) {

  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }



  onChangeValue = (value: CatalogData) => {
    if (isFunction(this.onChangeCallback)) {
      this.onChangeCallback(value.code);
    }
    this.onChangeSelection.emit(value);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.catId) {
      this.loaderCatIdCatalog();
    }
  }

  loaderCatIdCatalog = () => {
    this.httpService.get(`/Catalog/get?catId=${this.catId}`).subscribe((result: any) => {
      if (result) {
        this.catalogData = result.response;
      }
    }, err => {
      this.catalogData = [];
    });
  }

}
