import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../features/product/services/product.service';
import { AllProduct } from '../../../features/product/models/all-product.model';
import Swal from 'sweetalert2';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { Attachment } from '../../../features/product/models/attachment.model';
import { environment } from '../../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-productversion',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './show-productversion.component.html',
  styleUrl: './show-productversion.component.css',
})
export class ShowProductversionComponent implements OnInit, OnDestroy {
  @Input() data_path!: number;

  selectedFiles: File[] = [];
  product?: AllProduct;
  attachment_list: Attachment[] = [];
  attachmentBaseUrl?: string;
  productVersionId?: number | 0;

  private showProductVersionSubscription?: Subscription;
  private deleteAttachmentSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private dialogRef: MatDialogRef<ShowProductversionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productversionid: number }
  ) 
  {
    this.productVersionId = this.data.productversionid;
  }
  ngOnInit(): void {
    this.attachmentBaseUrl = `${environment.attachmentBaseUrl}`;

    if (this.data.productversionid) {
      this.productService
        .getProductByProductVersionId(this.data.productversionid)
        .subscribe({
          next: (response) => {
            //console.log(response);
            this.product = response;
            this.attachment_list = this.product.productVersions[0].attachments;
            console.log(this.product);
          },
        });
    }

    if (this.data_path) {
      // get the data from the api for this category id
      this.productService
        .getProductByProductVersionId(this.data_path)
        .subscribe({
          next: (response) => {
            this.product = response;
            this.attachment_list = this.product.productVersions[0].attachments;
            console.log(this.product);
          },
        });
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.showProductVersionSubscription?.unsubscribe();
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

  onFilesSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFiles = Array.from(fileInput.files);
    }
  }

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

  onDeleteAttachment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Call your delete logic here
        if (id) {
          this.deleteAttachmentSubscription = this.productService
            .deleteAttachment(id)
            .subscribe({
              next: (response) => {
                this.loadAttachments();
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
              },
              error: (error) => {
                ToastrUtils.showErrorToast(error);
              },
            });
        }
      } else {
        console.log('Delete operation cancelled.');
      }
    });
  }

  loadAttachments() {
    /*
      this.productService
        .getAttachmentsByProductId(this.productId)
        .subscribe((data) => {
          this.attachment_list = data;
        });
      */
  }
}
