import { Observable } from 'rxjs';
import { IDialogConfig } from './../dialog/dialog-config-model';
import { DialogComponent } from './../dialog/dialog-component';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {

  private dialogRef: MatDialogRef<DialogComponent>;

  constructor(private dialog: MatDialog) {

  }

  showConfirmationDialog = (message : string) :Observable<boolean> => {
    let actionLinks : Array<any> = [
      {linkName : 'Cancel' , method: ($event:any) => {this.closeDialog()},isCloseButton: true},
      {linkName: 'Ok',method: ($event:any) => this.onClickOK($event), isCloseButton: false}
    ];

    let modalData: IDialogConfig = {
      title: 'Confirmation',
      showCloseButton: true,
      isConfirmationDialog : true,
      confirmationMessage: message,
      actions:actionLinks
    };
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      height: '200px',
      data: modalData
    })
    return this.dialogRef.afterClosed();
  }

  closeDialog = () => {
    this.dialogRef.close(false);
  }

  onClickOK = (value:any) => {
    this.dialogRef.close(true);
  }

}
