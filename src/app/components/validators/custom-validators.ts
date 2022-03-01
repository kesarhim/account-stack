import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function feesPaidValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fesspaid =  control.value;
    const totalFees = control.parent?.get('totalFees')?.value;
    return fesspaid > totalFees ? {invalidFees : true} : null;
  };
}

export function ValidatePanNo():ValidatorFn {
  return (control:AbstractControl) :ValidationErrors | null => {
    const panNo = control.value;
    let isValid :boolean = new RegExp("([A-Z]|[a-z]){5}[0-9]{4}([A-Z]|[a-z]){1}").test(panNo);
    return isValid ? null : {invalidPanNo : true};
  }
}

export function ValidateAadhaarNo(value:string):boolean {
    let isValid :boolean = new RegExp("[0-9]{4}-[0-9]{4}-[0-9]{4}").test(value);
   return isValid;
}
