import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddProductVersionRequest } from '../../../features/productversion/models/add-productversion.model';
import { Subscription } from 'rxjs';
import { ProductversionService } from '../../../features/productversion/services/productversion.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ProductService } from '../../../features/product/services/product.service';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-productversion',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-productversion.component.html',
  styleUrl: './add-productversion.component.css',
})
export class AddProductversionComponent implements OnInit, OnDestroy {
  @Input() data!: number;
  @Output() refreshParent = new EventEmitter<void>();
  progress = 0;

  productVersion!: AddProductVersionRequest;
  selectedFiles: File[] = [];

  private addProductVersionSubscription?: Subscription;
  private addAttachmentsSubscripts?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

  constructor(
    private datepipe: DatePipe,
    private productVersionService: ProductversionService,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const myDate = new Date();
    const formatted = this.datepipe.transform(myDate, 'yyyy-MM-dd');

    console.log(this.data);
    this.productVersion = {
      version: '',
      versionDate: myDate || '',
      description: '',
      productId: this.data,
      userId: String(localStorage.getItem('user-id')),
    };
  }

  ngOnDestroy(): void {
    this.addProductVersionSubscription?.unsubscribe();
    this.addAttachmentsSubscripts?.unsubscribe();
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

  onFormSubmit() {
    this.addProductVersionSubscription = this.productVersionService
      .addProductVersion(this.productVersion)
      .subscribe({
        next: (response) => {
          //alert('Product Version Added.');

          // upload attachments if any
          this.uploadAttachmentSubscription = this.productService
            .uploadAttachment(this.selectedFiles, response.id.toString())
            .subscribe((event: HttpEvent<any>) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  if (event.total) {
                    this.progress = Math.round(
                      (100 * event.loaded) / event.total
                    );
                  }
                  break;
                case HttpEventType.Response:
                  //ToastrUtils.showToast('Product Added Successfully.');
                  //this.router.navigateByUrl('/admin/products');
                  ToastrUtils.showToast('Product version added with attachments');
                  this.progress = 0;
                  break;
              }
            });
        },
        error: (error) => {
          alert(error);
        },
      });

      // refresh parent component
      this.refreshParent.emit();
  }
}
