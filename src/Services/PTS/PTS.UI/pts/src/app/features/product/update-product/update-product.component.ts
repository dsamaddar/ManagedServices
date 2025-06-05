import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { parseISO, format } from 'date-fns';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
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
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SuggestionService } from '../services/suggestion.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ProductVersion } from '../../productversion/models/productversion.model';
import { ProductversionService } from '../../productversion/services/productversion.service';
import { BarcodeService } from '../services/barcode.service';
import { BarCodes } from '../../barcode/models/barcode.model';
import { AddBarCodeRequest } from '../models/add-barcode.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { PreviewBarcodeComponent } from '../preview-barcode/preview-barcode.component';
import { PreviewProductcodeComponent } from '../preview-productcode/preview-productcode.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { PreviewVersionComponent } from '../preview-version/preview-version.component';

@Component({
  selector: 'app-update-product',
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
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent implements AfterViewInit, OnDestroy {
  productId: number = 0;
  paramsSubscription?: Subscription;
  editProductSubscription?: Subscription;
  deleteProductSubscription?: Subscription;
  deleteAttachmentSubscription?: Subscription;
  product?: AllProduct;
  attachmentBaseUrl?: string;
  attachment_list: Attachment[] = [];
  user?: User;

  existing_version: string = '';

  ind_barcode: string = '';
  barcodes: AddBarCodeRequest[] = [];

  msg_error: string = '';
  msg_warning: string = '';
  msg_info: string = '';

  progress = 0;
  //product: AddProductRequest;
  selectedFiles: File[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  packtypes$?: Observable<PackType[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;
  printingCompanies: PrintingCompany[] = [];
  cylinderCompanies: CylinderCompany[] = [];

  private addProductSubscription?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

  isVersionUnique: boolean | null = null;
  isBarCodeUnique: boolean | null = null;

  ngForm: FormGroup;

  suggestions_brand: string[] = [];
  suggestions_flavourtype: string[] = [];
  suggestions_origin: string[] = [];
  suggestions_sku: string[] = [];
  suggestions_productcode: string[] = [];
  suggestions_version: string[] = [];
  suggestions_barcode: string[] = [];

  // search subjects
  private searchBrands = new Subject<string>();
  private searchFlavourTypes = new Subject<string>();
  private searchOrigins = new Subject<string>();
  private searchSKUs = new Subject<string>();
  private searchProductCodes = new Subject<string>();
  private searchVersions = new Subject<string>();
  private searchBarcodes = new Subject<string>();

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
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private dialogRef: MatDialogRef<UpdateProductComponent>,
    private productVersionService: ProductversionService,
    private barcodeService: BarcodeService,
    private overlay: Overlay,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { productid: number }
  ) {
    this.user = this.authService.getUser();
    this.productId = data.productid;
    //console.log(this.productId);

    if (this.productId) {
      //this.loadAttachments();

      // get the data from the api for this category id
      this.productService.getProductById(this.productId).subscribe({
        next: (response) => {
          this.product = response;
          //console.log(this.product);
          this.existing_version = this.product.version;

          this.product.productVersions.forEach((version) => {
            if (version.versionDate) {
              //version.versionDate = new Date(version.versionDate).toISOString().split('T')[0];
              version.versionDate = format(
                new Date(version.versionDate),
                'yyyy-MM-dd'
              );
            }
          });

          this.dataSource_product_version.data = this.product.productVersions;
          console.log(this.dataSource_product_version.data);
        },
      });

      // get barcodes from productid
      console.log(this.productId);
      this.barcodeService.getBarCodesByProdId(this.productId).subscribe({
        next: (response) => {
          console.log(response);
          this.barcodes = response;
          console.log('Fetch BarCodes: ');
          console.log(this.barcodes);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    this.ngForm = this.fb.group({
      categoryid: ['', Validators.required],
      brand: ['', Validators.required],
      flavourType: ['', Validators.required],
      origin: ['', Validators.required],
      sku: ['', Validators.required],
      productcode: ['', Validators.required],
      packtypeid: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close(true);
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

  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // block non-digit
    }
  }

  onProjectDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    if (event.value && this.product) {
      this.product.projectDate = event.value
        ? new Date(format(event.value, 'yyyy-MM-dd'))
        : new Date();
      console.log(this.product.projectDate);
    }

    // if (this.product?.projectDate) {
    //   console.log('setter: ' + value);

    //   this.product.projectDate = value ? new Date(value) : new Date();
    // }
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
              this.existing_version = this.product.version;
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

    // converting to plain array : printingCompanies
    this.printingCompanies$?.subscribe((companies) => {
      this.printingCompanies = companies;
    });

    // converting to plain array : cylinderCompanies
    this.cylinderCompanies$?.subscribe((companies) => {
      this.cylinderCompanies = companies;
    });

    // load brands
    this.searchBrands
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsBrand(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_brand = data;
      });

    // load flavour types
    this.searchFlavourTypes
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsFlavourType(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_flavourtype = data;
      });

    // load Origins
    this.searchOrigins
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsOrigin(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_origin = data;
      });

    // load SKUs
    this.searchSKUs
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsSKU(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_sku = data;
      });

    // load Product Codes
    this.searchProductCodes
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsProductCode(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_productcode = data;
      });

    // load Versions
    this.searchVersions
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsVersion(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_version = data;
        console.log(this.suggestions_version);
      });

    // load Barcodes
    this.searchBarcodes
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.suggestionService.getSuggestionsBarCode(term)
        )
      )
      .subscribe((data) => {
        this.suggestions_barcode = data;
      });
  }

  getCylinderCompanyName(id: number): string {
    if (id) {
      const company = this.cylinderCompanies.find((c) => c.id === id);
      return company ? company.name : id.toString();
    } else {
      return '';
    }
  }

  getPrintingCompanyName(id: number): string {
    if (id) {
      const company = this.printingCompanies.find((c) => c.id === id);
      return company ? company.name : id.toString();
    } else {
      return '';
    }
  }

  onSearchChangeBrand(value: string) {
    const upper = value.toUpperCase();

    if (this.product) {
      this.product.brand = upper; // updates ngModel immediately

      console.log('brand->' + upper);

      if (value && value.length >= 1) {
        this.searchBrands.next(upper);
      } else {
        this.suggestions_brand = [];
      }
    }
  }

  onSearchChangeFlavourType(value: string) {
    const upper = value.toUpperCase();

    if (this.product) {
      this.product.flavourType = upper; // updates ngModel immediately

      console.log('flavour->' + upper);

      if (value && value.length >= 1) {
        this.searchFlavourTypes.next(upper);
      } else {
        this.suggestions_flavourtype = [];
      }
    }
  }

  onSearchChangeOrigin(value: string) {
    const upper = value.toUpperCase();
    if (this.product) {
      this.product.origin = upper; // updates ngModel immediately

      console.log('origin->' + upper);
      if (value && value.length >= 1) {
        this.searchOrigins.next(upper);
      } else {
        this.suggestions_origin = [];
      }
    }
  }

  onSearchChangeSKU(value: string) {
    const upper = value.toUpperCase();

    if (this.product) {
      this.product.sku = upper; // updates ngModel immediately

      console.log('sku->' + upper);
      if (value && value.length >= 1) {
        this.searchSKUs.next(upper);
      } else {
        this.suggestions_sku = [];
      }
    }
  }

  onSearchChangeProductCode(value: string) {
    const upper = value.toUpperCase();
    this.hideProductCodeOverlay();

    if (this.product) {
      this.product.productCode = upper; // updates ngModel immediately

      //console.log('productcode->' + upper);
      if (value && value.length >= 1) {
        this.searchProductCodes.next(upper);
      } else {
        this.suggestions_productcode = [];
      }
    }
  }

  onSearchChangeVersion(value: string) {
    this.hideVersionOverlay();
    const upper = value.toUpperCase();

    if (this.product) {
      this.product.version = upper; // updates ngModel immediately

      console.log('version->' + upper);
      if (value && value.length >= 1) {
        this.searchVersions.next(upper);
        console.log('version->->' + upper);

        // check for the existing version
        if (this.product.version == this.existing_version) {
          return;
        }

        this.suggestionService.getIsVersionUnique(upper).subscribe({
          next: (response) => {
            this.isVersionUnique = response;
            if (this.isVersionUnique === false) {
              // console.log(this.isVersionUnique);
              // ToastrUtils.showErrorToast('Version Already Exists');
              this.msg_error = 'Version Already Exists : ' + upper;
            } else {
              this.msg_error = '';
            }
          },
        });
      } else {
        this.suggestions_version = [];
      }
    }
  }

  addToBarCodeList(): void {
    const trimmed = this.ind_barcode.trim();
    if (trimmed.length === 13) {
      const newBarcode: BarCodes = {
        productId: Date.now(), // Temporary unique ID
        barCode: trimmed,
      };
      this.barcodes.push(newBarcode);
      this.ind_barcode = ''; // Clear input
      this.msg_warning = '';
    } else {
      this.msg_warning = 'Barcode must have a length of 13 digits.';
    }
  }

  removeBarcodeFromList(index: number) {
    const marked_barcode = this.barcodes[index].barCode;

    this.barcodeService
      .deleteBarcodeByName({
        productId: this.product?.id ?? 0,
        barCode: marked_barcode,
      })
      .subscribe({
        next: () => {
          // Only remove from list if API call succeeds
          this.barcodes.splice(index, 1);
          console.log('Barcode deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete barcode:', err);
          this.barcodes.splice(index, 1);
        },
      });
  }

  onSearchChangeBarcode(value: string) {
    const upper = value.toUpperCase();
    this.hideBarCodeOverlay();

    if (this.product) {
      //this.product.barcode = upper; // updates ngModel immediately

      console.log('barcode->' + upper);
      if (value && value.length >= 1) {
        this.searchBarcodes.next(upper);

        this.suggestionService.getIsBarCodeUnique(upper).subscribe({
          next: (response) => {
            this.isBarCodeUnique = response;
            if (this.isBarCodeUnique === false) {
              console.log(this.isBarCodeUnique);
              // ToastrUtils.showErrorToast(
              //   'Barcode Already Exists (' + upper + ')'
              // );
              this.msg_warning = 'Barcode Already Exists (' + upper + ')';
            }
          },
        });
      } else {
        this.suggestions_barcode = [];
      }
    }
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
    this.hideBarCodeOverlay();
    this.hideProductCodeOverlay();
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid || this.isVersionUnique === false) {
      this.ngForm.markAllAsTouched();
      console.log('invalid form');
      return;
    }

    if (
      this.product?.categoryId == 0 ||
      this.product?.packTypeId == 0 ||
      this.cylindercompanyid == 0 ||
      this.printingcompanyid == 0
    ) {
      //alert('Missing: Category/Project/Cylinder Company/Printing Company');
      // ToastrUtils.showErrorToast(
      //   'Missing: Category/Pack Type/Cylinder Company/Printing Company'
      // );
      this.msg_error =
        'Missing: Category/Pack Type/Cylinder Company/Printing Company';
      return;
    }

    if (!this.product?.id) {
      this.msg_error = 'Product ID is missing';
      return;
    }

    if (!Array.isArray(this.barcodes) || this.barcodes.length === 0) {
      this.msg_error = 'Barcodes array is empty or invalid';
      return;
    }

    const updateProductRequest: UpdateProductRequest = {
      categoryid: this.product?.categoryId,
      packtypeid: this.product?.packTypeId,
      brand: this.product?.brand,
      flavourtype: this.product?.flavourType,
      origin: this.product?.origin,
      sku: this.product?.sku,
      productcode: this.product?.productCode,
      version: this.product?.version,
      projectdate: this.product?.projectDate,
      // barcode: this.product?.barcode,
      // cylindercompanyid: this.product?.cylinderCompanyId,
      // printingcompanyid: this.product?.printingCompanyId,
      userId: String(localStorage.getItem('user-id')),
    };

    // pass this object to service
    if (this.product?.id) {
      console.log(updateProductRequest);
      this.editProductSubscription = this.productService
        .updateProduct(this.product?.id, updateProductRequest)
        .subscribe({
          next: (response) => {
            // add to barcode model
            if (!this.product || this.product.id == null) {
              console.error('Product ID is missing');
              return;
            }

            // delete previous barcodes
            this.barcodeService
              .deleteBarcodeByProdId(this.product.id)
              .subscribe({
                next: (response) => {
                  console.log('previous barcodes deleted');
                },
                error: (error) => {
                  console.log(error);
                },
              });

            // add new barcodes
            const requests_barcode = this.barcodes.map((barcode) => {
              const barcode_model: AddBarCodeRequest = {
                productId: this.product?.id ?? 0,
                barCode: barcode.barCode,
              };
              console.log(barcode_model);
              return this.barcodeService.AddBarCode(barcode_model);
            });

            forkJoin(requests_barcode).subscribe({
              next: (responses) =>
                console.log('All barcodes added successfully:', responses),
              error: (err) => console.error('Failed to add barcodes:', err),
            });

            if (this.selectedFiles.length === 0) {
              //ToastrUtils.showErrorToast('No File Selected');
              ToastrUtils.showToast('Product Updated Without Attachment.');
              //this.router.navigateByUrl('/admin/products');
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

            this.close();
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

  displayedColumns: string[] = [
    'version',
    'versionDate',
    'description',
    'cylinderCompanyId',
    'printingCompanyId',
    'cylinderPrNo',
    'cylinderPoNo',
    'printingPrNo',
    'printingPoNo',
    'actions',
  ];
  dataSource_product_version = new MatTableDataSource<ProductVersion>();
  editingRow: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource_product_version.paginator = this.paginator;
    this.dataSource_product_version.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource_product_version.filter = filterValue;
  }

  originalRowBackup: ProductVersion | null = null;
  editedRow: ProductVersion | null = null;

  editRow(row: ProductVersion) {
    // Create a shallow copy to avoid mutating the original row
    this.originalRowBackup = { ...row } as ProductVersion;
    this.editedRow = { ...row } as ProductVersion;
    this.existing_version = row.version;
    this.editingRow = row.id;
  }

  saveRow(row: ProductVersion) {
    this.suggestionService.getIsVersionUnique(row.version).subscribe({
      next: (response) => {
        this.isVersionUnique = response;
        if (this.isVersionUnique === false) {
          // Optionally restore backup if you're tracking it
          if (this.originalRowBackup) {
            const index = this.dataSource_product_version.data.findIndex(
              (p) => p.id === row.id
            );
            if (index !== -1) {
              this.dataSource_product_version.data[index] = {
                ...this.originalRowBackup,
              };
              this.dataSource_product_version._updateChangeSubscription();
            }
          }

          this.msg_error =
            'Version Already Exists : ' + row.version + ' [updated failed]';
          this.editedRow = null;
          this.editingRow = null;
          return;
        } else {
          this.msg_error = '';
        }
      },
    });

    this.productVersionService.updateProductVersion(row.id, row).subscribe({
      next: (response) => {
        console.log('updated');
        this.editingRow = null;
        this.editedRow = null;
        this.originalRowBackup = null;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.editingRow = null;
  }

  cancelEdit() {
    if (this.originalRowBackup) {
      const index = this.dataSource_product_version.data.findIndex(
        (p) => p.id === this.originalRowBackup?.id
      );

      if (index !== -1) {
        this.dataSource_product_version.data[index] = {
          ...this.originalRowBackup,
        };
        this.dataSource_product_version._updateChangeSubscription();
      }
    }

    this.editedRow = null;
    this.originalRowBackup = null;
    this.editingRow = null;
    this.msg_error = '';
    this.msg_info = '';
    this.msg_warning = '';
  }

  private overlayBarCodeRef: OverlayRef | null = null;

  showBarCodeOverlay(event: MouseEvent, option: any): void {
    this.hideBarCodeOverlay(); // Close existing

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    this.overlayBarCodeRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const injector = Injector.create({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: option }],
      parent: this.injector,
    });

    const portal = new ComponentPortal(
      PreviewBarcodeComponent,
      this.viewContainerRef,
      injector
    );
    this.overlayBarCodeRef.attach(portal);
  }

  hideBarCodeOverlay(): void {
    if (this.overlayBarCodeRef) {
      this.overlayBarCodeRef.detach();
      this.overlayBarCodeRef.dispose();
      this.overlayBarCodeRef = null;
    }
  }

  private overlayProductCodeRef: OverlayRef | null = null;

  showProductCodeOverlay(event: MouseEvent, option: any): void {
    this.hideProductCodeOverlay(); // Close existing
    console.log(option);
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    this.overlayProductCodeRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const injector = Injector.create({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: option }],
      parent: this.injector,
    });

    const portal = new ComponentPortal(
      PreviewProductcodeComponent,
      this.viewContainerRef,
      injector
    );
    this.overlayProductCodeRef.attach(portal);
  }

  hideProductCodeOverlay(): void {
    if (this.overlayProductCodeRef) {
      this.overlayProductCodeRef.detach();
      this.overlayProductCodeRef.dispose();
      this.overlayProductCodeRef = null;
    }
  }

  private overlayVersionRef: OverlayRef | null = null;

  showVersionOverlay(event: MouseEvent, option: any): void {
    this.hideVersionOverlay(); // Close existing
    console.log(option);
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    this.overlayVersionRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const injector = Injector.create({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: option }],
      parent: this.injector,
    });

    const portal = new ComponentPortal(
      PreviewVersionComponent,
      this.viewContainerRef,
      injector
    );
    this.overlayVersionRef.attach(portal);
  }

  hideVersionOverlay(): void {
    if (this.overlayVersionRef) {
      this.overlayVersionRef.detach();
      this.overlayVersionRef.dispose();
      this.overlayVersionRef = null;
    }
  }
}
