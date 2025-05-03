import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { AllProduct } from '../models/all-product.model';
import { Category } from '../../category/models/category.model';
import { ProductCode } from '../../productCode/models/productcode.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { CategoryService } from '../../category/services/category.service';
import { ProductCodeService } from '../../productCode/services/productcode.service';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { environment } from '../../../../environments/environment';
import { ToastrUtils } from '../../../utils/toastr-utils';
import Swal from 'sweetalert2';
import { Attachment } from '../models/attachment.model';
import { UpdateProductRequest } from '../models/edit-product.model';
import { PackType } from '../../packtype/models/packtype.model';
import { PacktypeService } from '../../packtype/services/packtype.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-product',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    FileSelectorComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit, OnDestroy {
  productId: number = 0;
  paramsSubscription?: Subscription;
  editProductSubscription?: Subscription;
  deleteProductSubscription?: Subscription;
  deleteAttachmentSubscription?: Subscription;
  product?: AllProduct;
  attachmentBaseUrl?: string;
  attachment_list: Attachment[] = [];

  progress = 0;
  //product: AddProductRequest;
  selectedFiles: File[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  packtypes$?: Observable<PackType[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  private addProductSubscription?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

  isVersionUnique:  boolean | null = null;
  isBarCodeUnique:  boolean | null = null;

  ngForm: FormGroup;

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
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService,
    private productCodeService: ProductCodeService,
    private packTypeService: PacktypeService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private fb: FormBuilder
  ) {

    this.ngForm = this.fb.group({
      categoryid: ['', Validators.required],
      brand: ['', Validators.required],
      flavourtype: ['', Validators.required],
      origin: ['', Validators.required],
      sku: ['', Validators.required],
      productcode: ['', Validators.required],
      version: ['', Validators.required],
      barcode: ['', Validators.required],
      projectdate: ['', Validators.required],
      packtypeid: ['', Validators.required],
      cylindercompanyid: ['', Validators.required],
      printingcompanyid: ['', Validators.required],
    });

  }

  get projectDateString(): string {
    if (!this.product?.projectDate) {
      return '';
    }

    const date = new Date(this.product.projectDate);
    //console.log('getter: ' + String(date));
    //return date.toISOString().split('T')[0];

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  set projectDateString(value: string) {
    if (this.product?.projectDate) {
      this.product.projectDate = value ? new Date(value) : new Date();
    }
  }

  onProjectDateChange(value: string) {
    if (this.product?.projectDate) {
      console.log('setter: ' + value);

      this.product.projectDate = value ? new Date(value) : new Date();
    }
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

  categoryid?: number;
  projectid?: number;
  cylindercompanyid?: number;
  printingcompanyid?: number;

  ngOnInit(): void {
    this.attachmentBaseUrl = `${environment.attachmentBaseUrl}`;

    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.productId = Number(params.get('id'));
        this.loadAttachments();

        if (this.productId) {
          // get the data from the api for this category id
          this.productService.getProductById(this.productId).subscribe({
            next: (response) => {
              this.product = response;
              //console.log(this.product);
            },
          });
        }
      },
    });

    this.categories$ = this.categoryService.getAllCategories();
    this.packtypes$ = this.packTypeService.getAllPackTypes();
    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();
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
    this.deleteAttachmentSubscription?.unsubscribe();
  }

  onFormSubmit() {
    if (
      this.product?.categoryId == 0 ||
      this.product?.packTypeId == 0 ||
      this.product?.cylinderCompanyId == 0 ||
      this.product?.printingCompanyId == 0
    ) {
      //alert('Missing: Category/Project/Cylinder Company/Printing Company');
      ToastrUtils.showErrorToast(
        'Missing: Category/Pack Type/Cylinder Company/Printing Company'
      );
      return;
    }

    const updateProductRequest: UpdateProductRequest = {
      categoryid: this.product?.categoryId,
      packtypeid: this.product?.packTypeId,
      brand: this.product?.brand,
      flavourtype: this.product?.flavourType,
      origin: this.product?.origin,
      sku: this.product?.origin,
      productcode: this.product?.productCode,
      version: this.product?.version,
      projectdate: this.product?.projectDate,
      barcode: this.product?.barcode,
      cylindercompanyid: this.product?.cylinderCompanyId,
      printingcompanyid: this.product?.printingCompanyId,
      userId: String(localStorage.getItem('user-id')),
    };

    // pass this object to service
    if (this.product?.id) {
      console.log(updateProductRequest);
      this.editProductSubscription = this.productService
        .updateProduct(this.product?.id, updateProductRequest)
        .subscribe({
          next: (response) => {
            if (this.selectedFiles.length === 0) {
              //ToastrUtils.showErrorToast('No File Selected');
              ToastrUtils.showToast('Product Updated Without Attachment.');
              this.router.navigateByUrl('/admin/products');
              //return;
            } else {
              this.uploadAttachmentSubscription = this.productService
                .uploadAttachment(
                  this.selectedFiles,
                  this.product?.id.toString() ?? '0'
                )
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
                      ToastrUtils.showToast('Product Updated Successfully.');
                      this.router.navigateByUrl('/admin/products');
                      this.progress = 0;
                      break;
                  }
                });
            }
          },
        });
    }
  }

  loadAttachments() {
    this.productService
      .getAttachmentsByProductId(this.productId)
      .subscribe((data) => {
        this.attachment_list = data;
      });
  }

  onDeleteProduct() {
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
        if (this.product?.id) {
          this.deleteProductSubscription = this.productService
            .deleteProduct(this.product?.id)
            .subscribe({
              next: (response) => {
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                this.router.navigateByUrl('/admin/products');
              },
              error: (error) => {
                ToastrUtils.showErrorToast('Not Authorized To Delete!');
              },
            });
        }
      } else {
        console.log('Delete operation cancelled.');
      }
    });
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
}
