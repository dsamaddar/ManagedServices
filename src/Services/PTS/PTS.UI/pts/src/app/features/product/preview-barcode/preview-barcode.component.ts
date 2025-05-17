import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-barcode',
  imports: [CommonModule],
  templateUrl: './preview-barcode.component.html',
  styleUrl: './preview-barcode.component.css'
})
export class PreviewBarcodeComponent {
  @Input() barcode!: string;
  @Input() position!: { top: number; left: number };
}
