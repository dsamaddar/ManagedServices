import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { AddCategoryRequest } from '../../category/models/add-category-request.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { NumericLiteral } from 'typescript';
import { Product } from '../models/product.model';
import { AddProductRequest } from '../models/add-product.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../services/product.service';
import { ProductCode } from '../../productCode/models/productcode.model';
import { ProductCodeService } from '../../productCode/services/productcode.service';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { ProductVersion } from '../../productversion/models/productversion.model';
import { ProductversionService } from '../../productversion/services/productversion.service';
import { AddProductVersionRequest } from '../../productversion/models/add-productversion.model';
import { PackType } from '../../packtype/models/packtype.model';
import { PacktypeService } from '../../packtype/services/packtype.service';
import { SuggestionService } from '../services/suggestion.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatDatepickerModule,
    NgSelectModule,
    FormsModule,
    FileSelectorComponent,
    MatNativeDateModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit, OnDestroy {
  progress = 0;
  product: AddProductRequest;
  productVersion: AddProductVersionRequest;
  selectedFiles: File[] = [];
  productVersionId: number = 0;

  isVersionUnique:  boolean | null = null;
  isBarCodeUnique:  boolean | null = null;

  ngForm: FormGroup;

  suggestions_brand: string[] = [];
  suggestions_flavourtype: string[] = [];
  suggestions_origin: string[] = [];
  suggestions_sku: string[] = [];
  suggestions_productcode: string[] = [];
  suggestions_version: string[] = [];
  suggestions_barcode: string[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  packtypes$?: Observable<PackType[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  private addProductSubscription?: Subscription;
  private addProductVersionSubscription?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

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
    private categoryService: CategoryService,
    private productCodeService: ProductCodeService,
    private packTypeService: PacktypeService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private productService: ProductService,
    private productVersionService: ProductversionService,
    private suggestionService: SuggestionService,
    private router: Router,
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

    const myDate = new Date();
    const formatted = this.datepipe.transform(myDate, 'yyyy-MM-dd');

    this.product = {
      id: 0,
      categoryid: 0,
      packtypeid: 0,
      brand: '',
      flavourtype: '',
      origin: '',
      sku: '',
      productcode: '',
      version: '',
      projectdate: myDate || '',
      barcode: '',
      cylindercompanyid: 0,
      printingcompanyid: 0,
      userId: '',
    };

    this.productVersion = {
      version: '',
      versionDate: myDate || '',
      description: '',
      productId: 0,
      userId: '',
    };
  }

  categoryid?: number;
  packtypeid?: number;
  cylindercompanyid?: number;
  printingcompanyid?: number;

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.packtypes$ = this.packTypeService.getAllPackTypes();
    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();

    this.product.projectdate = new Date();

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

  onSearchChangeBrand(value: string) {
    const upper = value.toUpperCase();
    this.product.brand = upper; // updates ngModel immediately

    console.log('brand->' + upper);

    if (value && value.length >= 1) {
      this.searchBrands.next(upper);
    } else {
      this.suggestions_brand = [];
    }
  }

  onSearchChangeFlavourType(value: string) {
    const upper = value.toUpperCase();
    this.product.flavourtype = upper; // updates ngModel immediately

    console.log('flavourtype->' + upper);
    if (value && value.length >= 1) {
      this.searchFlavourTypes.next(upper);
    } else {
      this.suggestions_flavourtype = [];
    }
  }

  onSearchChangeOrigin(value: string) {
    const upper = value.toUpperCase();
    this.product.origin = upper; // updates ngModel immediately

    console.log('origin->' + upper);
    if (value && value.length >= 1) {
      this.searchOrigins.next(upper);
    } else {
      this.suggestions_origin = [];
    }
  }

  onSearchChangeSKU(value: string) {
    const upper = value.toUpperCase();
    this.product.sku = upper; // updates ngModel immediately

    console.log('sku->' + upper);
    if (value && value.length >= 1) {
      this.searchSKUs.next(upper);
    } else {
      this.suggestions_sku = [];
    }
  }

  onSearchChangeProductCode(value: string) {
    const upper = value.toUpperCase();
    this.product.productcode = upper; // updates ngModel immediately

    //console.log('productcode->' + upper);
    if (value && value.length >= 1) {
      this.searchProductCodes.next(upper);
    } else {
      this.suggestions_productcode = [];
    }
  }

  onSearchChangeVersion(value: string) {
    const upper = value.toUpperCase();
    this.product.version = upper; // updates ngModel immediately

    console.log('version->' + upper);
    if (value && value.length >= 1) {
      this.searchVersions.next(upper);
      console.log('version->->' + upper);

      this.suggestionService.getIsVersionUnique(upper).subscribe({
        next: (response) => {
          this.isVersionUnique = response;
          if(this.isVersionUnique === false){
            console.log(this.isVersionUnique);
            this.product.version = "";
            ToastrUtils.showErrorToast('Version Already Exists');
          }
          
        },
      });
    } else {
      this.suggestions_version = [];
    }
  }

  onSearchChangeBarcode(value: string) {
    const upper = value.toUpperCase();
    this.product.barcode = upper; // updates ngModel immediately

    console.log('barcode->' + upper);
    if (value && value.length >= 1) {
      this.searchBarcodes.next(upper);

      this.suggestionService.getIsBarCodeUnique(upper).subscribe({
        next: (response) => {
          this.isBarCodeUnique = response;
          if(this.isBarCodeUnique === false){
            console.log(this.isBarCodeUnique);
            ToastrUtils.showErrorToast('Barcode Already Exists (' + upper + ')' );
          }
          
        },
      });
    } else {
      this.suggestions_barcode = [];
    }
  }

  get projectDateString(): string {
    return this.product.projectdate.toISOString().split('T')[0];
  }

  onProjectDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.product.projectdate = event.value;
      console.log(this.product.projectdate);
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

  onFormSubmit(form: NgForm) {
    if (form.invalid || this.isVersionUnique === false) {
      this.ngForm.markAllAsTouched();
      console.log('invalid form');
      return;
    }

    this.product.userId = String(localStorage.getItem('user-id'));
    this.product.categoryid = this.categoryid || 0;
    this.product.packtypeid = this.packtypeid || 0;
    this.product.cylindercompanyid = this.cylindercompanyid || 0;
    this.product.printingcompanyid = this.printingcompanyid || 0;

    if (
      this.product.categoryid == 0 ||
      this.product.packtypeid == 0 ||
      this.product.cylindercompanyid == 0 ||
      this.product.printingcompanyid == 0
    ) {
      //alert('Missing: Category/Project/Cylinder Company/Printing Company');
      ToastrUtils.showErrorToast(
        'Missing: Category/Project/Cylinder Company/Printing Company'
      );
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
            //return;
          }

          // add product version
          this.productVersion = {
            version: this.product.version,
            versionDate: this.product.projectdate,
            description: '',
            productId: this.product.id,
            userId: String(localStorage.getItem('user-id')),
          };

          console.log(this.productVersion);

          this.addProductVersionSubscription = this.productVersionService
            .addProductVersion(this.productVersion)
            .subscribe({
              next: (response) => {
                //console.log('Product Version Id: ' + String(response.id));
                //this.productVersionId = response.id;

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

          // attachments associated with product version
          if (this.productVersionId > 0) {
          }
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
    this.addProductVersionSubscription?.unsubscribe();
  }
}
