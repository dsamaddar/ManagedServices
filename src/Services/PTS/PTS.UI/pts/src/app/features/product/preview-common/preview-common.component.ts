import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-common',
  imports: [],
  templateUrl: './preview-common.component.html',
  styleUrl: './preview-common.component.css'
})
export class PreviewCommonComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }
}
