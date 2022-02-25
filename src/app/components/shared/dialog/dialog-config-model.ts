import { TemplateRef } from '@angular/core';
export interface IDialogConfig {
    template? : TemplateRef<any>;
    title:string;
    showCloseButton : boolean;
    isConfirmationDialog?:boolean;
    confirmationMessage? : string;
    actions?: Array<{linkName : string , method: Function,isCloseButton: boolean}>;
}
