import { IDialogConfig } from './dialog-config-model';
import { Component, OnInit, Input, TemplateRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.html',
  styleUrls:['./dialog-component.css']
})

export class DialogComponent implements OnInit {

  public dialogConfig : IDialogConfig;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogConfig,private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit() {
    this.dialogConfig = this.data;
    this.dialogRef.disableClose = true;
  }
}
