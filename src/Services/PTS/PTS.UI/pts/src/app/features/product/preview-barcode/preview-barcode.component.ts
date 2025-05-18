import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { AllProduct } from '../models/all-product.model';
import { Subscription } from 'rxjs';
import { isTemplateSpan } from 'typescript';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-preview-barcode',
  imports: [CommonModule],
  templateUrl: './preview-barcode.component.html',
  styleUrl: './preview-barcode.component.css',
})
export class PreviewBarcodeComponent implements OnDestroy {
  productId?: number = 0;
  product?: AllProduct;
  private paramsSubscription?: Subscription;
  private viewProductSubscription?: Subscription;
  attachmentBaseUrl?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.attachmentBaseUrl = `${environment.attachmentBaseUrl}`;


    if ((data ?? 0) > 0) {
      this.productService.getProductByBarCode(data ?? 0).subscribe({
        next: (response) => {
          this.product = response;
          //console.log(this.product);
        },
      });
    } else {
      this.paramsSubscription = this.route.paramMap.subscribe({
        next: (params) => {
          this.productId = Number(params.get('id'));
          if (this.productId) {
            // get the data from the api for this category id
            this.productService.getProductByBarCode(data).subscribe({
              next: (response) => {
                this.product = response;
                console.log(this.product);
              },
            });
          }
        },
      });
    }
  }

  iconList = [
    // array of icon class list based on type
    { type: 'docx', icon: 'fas fa-file-word' },
    { type: 'doc', icon: 'fas fa-file-word' },
    { type: 'xlsx', icon: 'fas fa-file-excel' },
    { type: 'xls', icon: 'fas fa-file-excel' },
    { type: 'pdf', icon: 'bi bi-filetype-pdf' },
    { type: 'jpg', icon: 'fas fa-file-image' },
    { type: 'png', icon: 'bi bi-filetype-png' },
    { type: 'bmp', icon: 'bi bi-filetype-bmp' },
    { type: 'gif', icon: 'bi bi-filetype-gif' },
    { type: 'ppt', icon: 'fas fa-file-ppt' },
    { type: 'jpeg', icon: 'fas fa-file-image' },
    { type: 'mp4', icon: 'bi bi-filetype-mp4' },
    { type: 'exe', icon: 'bi bi-filetype-exe' },
    { type: 'msi', icon: 'bi bi-filetype-exe' },
    { type: 'txt', icon: 'bi bi-journal-text' },
    { type: 'csv', icon: 'bi bi-filetype-csv' },
    { type: 'ai', icon: 'bi bi-filetype-ai' },
    { type: 'zip', icon: 'bi bi-file-zip-fill' },
    { type: 'rar', icon: 'bi bi-file-zip-fill' },
    { type: '7z', icon: 'bi bi-file-zip-fill' },
    { type: 'psd', icon: 'bi bi-filetype-psd' },
    { type: 'tiff', icon: 'bi bi-filetype-tiff' },
    { type: 'svg', icon: 'bi bi-filetype-svg' },
    { type: 'sql', icon: 'bi bi-filetype-sql' },
    { type: 'raw', icon: 'bi bi-filetype-raw' },
    { type: 'mp3', icon: 'bi bi-filetype-mp3' },
    { type: 'mov', icon: 'bi bi-filetype-mov' },
    { type: 'mov', icon: 'bi bi-filetype-aac' },
  ];

  getFileExtension(filename: string): string {
    let ext = filename.split('.').pop();
    let obj = this.iconList.filter((row) => {
      if (row.type === ext) {
        return true;
      }

      return '';
    });

    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      console.log('not found');
      return 'bi bi-paperclip';
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.viewProductSubscription?.unsubscribe();
  }
}
