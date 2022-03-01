import { isFunction } from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-picker-component',
  templateUrl: 'date-picker-component.html',
  styleUrls:['./date-picker-component.css'],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent)
    },
  ]
})

export class DatePickerComponent implements OnInit,ControlValueAccessor {
  public _value :Date;

  @Input() placeholder:string;
  private onTouchedCallback = () => { }
  private onChangeCallback = (value: any) => { };


  constructor() { }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if(isFunction(this.onChangeCallback)){
      this.onChangeCallback(event.value);
    }
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

  ngOnInit() { }
}
