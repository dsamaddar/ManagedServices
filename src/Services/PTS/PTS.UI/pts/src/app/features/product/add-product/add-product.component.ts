import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { AddCategoryRequest } from '../../category/models/add-category-request.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { NumericLiteral } from 'typescript';
import { Product } from '../models/product.model';
import { AddProductRequest } from '../models/add-product.model';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../services/product.service';
import { ProductCode } from '../../productCode/models/productcode.model';
import { ProductCodeService } from '../../productCode/services/productcode.service';
import { ToastrUtils } from '../../../utils/toastr-utils';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    MatDatepickerModule,
    NgSelectModule,
    FormsModule,
    FileSelectorComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit, OnDestroy {
  progress = 0;
  product: AddProductRequest;
  selectedFiles: File[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  productCode$?: Observable<ProductCode[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  private addProductSubscription?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

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

  constructor(
    private categoryService: CategoryService,
    private productCodeService: ProductCodeService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private productService: ProductService,
    private router: Router,
    private datepipe: DatePipe,
    private http: HttpClient
  ) {
    const myDate = new Date();
    const formatted = this.datepipe.transform(myDate, 'yyyy-MM-dd');

    this.product = {
      id: 0,
      categoryid: 0,
      productCodeId: 0,
      brand: '',
      flavourtype: '',
      origin: '',
      sku: '',
      packtype: '',
      version: '',
      projectdate: formatted || '',
      barcode: '',
      cylindercompanyid: 0,
      printingcompanyid: 0,
      userId: '',
    };
  }

  categoryid?: number;
  productCodeId?: number;
  cylindercompanyid?: number;
  printingcompanyid?: number;

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.productCode$ = this.productCodeService.getAllProjects();
    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();
  }

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
    this.product.userId = String(localStorage.getItem('user-id'));
    this.product.categoryid = this.categoryid || 0;
    this.product.productCodeId = this.productCodeId || 0;
    this.product.cylindercompanyid = this.cylindercompanyid || 0;
    this.product.printingcompanyid = this.printingcompanyid || 0;

    if (
      this.product.categoryid == 0 ||
      this.product.productCodeId == 0 ||
      this.product.cylindercompanyid == 0 ||
      this.product.printingcompanyid == 0
    ) {
      //alert('Missing: Category/Project/Cylinder Company/Printing Company');
      ToastrUtils.showErrorToast('Missing: Category/Project/Cylinder Company/Printing Company');
      return;
    }

    // Call Service to insert product data
    this.addProductSubscription = this.productService
      .AddProduct(this.product)
      .subscribe({
        next: (response) => {
          this.product.id = response.id;
          console.log(
            'Product created successfully : id->' + this.product.id.toString()
          );

          if (this.selectedFiles.length === 0) {
            ToastrUtils.showErrorToast('No File Selected');
            return;
          }

          this.uploadAttachmentSubscription = this.productService
            .uploadAttachment(this.selectedFiles, this.product.id.toString())
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
                  ToastrUtils.showToast('Product Added Successfully.');
                  this.router.navigateByUrl('/admin/products');
                  this.progress = 0;
                  break;
              }
            });
        },
        error: (error) => {
          ToastrUtils.showErrorToast(error);
        },
      });
  }

  isFileSelectorVisible: boolean = false;

  openFileSelector(): void {
    this.isFileSelectorVisible = true;
  }

  closeFileSelector(): void {
    this.isFileSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.addProductSubscription?.unsubscribe();
    this.uploadAttachmentSubscription?.unsubscribe();
  }
}
