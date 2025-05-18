import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-barcode',
  imports: [CommonModule],
  templateUrl: './preview-barcode.component.html',
  styleUrl: './preview-barcode.component.css'
})
export class PreviewBarcodeComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    //console.log(data);
  }
}
