import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  FormsModule,
  ReactiveFormsModule,
  ValueChangeEvent,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { map, Observable, Subject, Subscribable, Subscription } from 'rxjs';
import { AllProduct } from '../models/all-product.model';
import { AddProductversionComponent } from '../../../shared/components/add-productversion/add-productversion.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProductversionService } from '../../productversion/services/productversion.service';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { ShowProductversionComponent } from '../../../shared/components/show-productversion/show-productversion.component';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ExcelExportService } from '../services/excel-export.service';
import { Category } from '../../category/models/category.model';
import { PackType } from '../../packtype/models/packtype.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../../category/services/category.service';
import { PacktypeService } from '../../packtype/services/packtype.service';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { SuggestionService } from '../services/suggestion.service';
import { ViewProductComponent } from '../view-product/view-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { ProductExport } from '../models/productexport.model';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AddProductversionComponent,
    ShowProductversionComponent,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  @ViewChild('queryText') queryText!: ElementRef<HTMLInputElement>;
  @ViewChild('selectPageSize') selectPageSize!: ElementRef<HTMLSelectElement>;

  products$?: Observable<AllProduct[]>;
  totalProductCount?: number;
  page_list: number[] = [];
  pageNumber = 1;
  pageSize = 50;
  global_query?: string;
  master_product_id: number = 0;
  product_version_id: number = 0;
  user?: User;

  filtered_brand: string[] | undefined = undefined;
  filtered_flavourtype: string[] | undefined = undefined;
  filtered_origin: string[] | undefined = undefined;
  filtered_sku: string[] | undefined = undefined;

  // observable array
  categories$?: Observable<Category[]>;
  packtypes$?: Observable<PackType[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  categoryid?: number[];
  packtypeid?: number[];
  cylindercompanyid?: number[];
  printingcompanyid?: number[];

  private deleteProductVersionSubscription?: Subscription;

  isProductVersionModalVisible: boolean = false;
  isShowProductVersionModalVisible: boolean = false;

  brands$?: Observable<string[]>;
  flavourtypes$?: Observable<string[]>;
  origins$?: Observable<string[]>;
  skus$?: Observable<string[]>;

  private searchBrands = new Subject<string>();
  private searchFlavourTypes = new Subject<string>();
  private searchOrigins = new Subject<string>();
  private searchSKUs = new Subject<string>();

  constructor(
    private productService: ProductService,
    private productVersionService: ProductversionService,
    private router: Router,
    private authService: AuthService,
    private excelService: ExcelExportService,
    private categoryService: CategoryService,
    private packTypeService: PacktypeService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private suggestionService: SuggestionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.categories$ = this.categoryService.getAllCategories();
    this.packtypes$ = this.packTypeService.getAllPackTypes();
    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();

    this.products$ = this.productService.getAllProducts(
      undefined,
      this.pageNumber,
      this.pageSize
    );

    this.productService.getProductCount(undefined).subscribe({
      next: (value) => {
        this.totalProductCount = value;
        this.page_list = new Array(
          Math.ceil(this.totalProductCount / this.pageSize)
        );
      },
    });

    // load brands
    this.brands$ = this.suggestionService.getSuggestionsBrand(
      '%',
      this.categoryid
    );

    // load flavoour type
    this.flavourtypes$ = this.suggestionService.getSuggestionsFlavourType('%');

    // load origin
    this.origins$ = this.suggestionService.getSuggestionsOrigin('%');

    // load SKU
    this.skus$ = this.suggestionService.getSuggestionsSKU('%');
  }

  exportToExcel2(query: string) {
  this.productService
    .getAllProducts(
      query,
      0,
      10000000,
      this.categoryid,
      this.filtered_brand,
      this.filtered_flavourtype,
      this.filtered_origin,
      this.filtered_sku,
      this.packtypeid,
      this.cylindercompanyid,
      this.printingcompanyid
    )
    .subscribe((products) => {
      const exportData: ProductExport[] = [];

      products.forEach((p) => {
        if (p.productVersions && p.productVersions.length > 0) {
          p.productVersions.forEach((v) => {
            exportData.push({
              // Product info
              Category: p.category?.name,
              Brand: p.brand,
              Flavour: p.flavourType,
              Origin: p.origin,
              SKU: p.sku,
              ProductCode: p.productCode,
              PackType: p.packType?.name,
              BarCode: p.barcode,
              // ProductVersion info
              Version: v.version,
              VersionDate: v.versionDate
                ? new Date(v.versionDate).toISOString().slice(0, 10)
                : '',
              Description: v.description,
              PR_No: v.prNo,
              PO_No: v.poNo,
              CylinderCompany: v.cylinderCompany?.name,
              PrintingCompany: v.printingCompany?.name,
            });
          });
        } else {
          // Optional: handle products without versions
          exportData.push({
            Category: p.category?.name,
            Brand: p.brand,
            Flavour: p.flavourType,
            Origin: p.origin,
            SKU: p.sku,
            ProductCode: p.productCode,
            PackType: p.packType?.name,
            BarCode: p.barcode,
            Version: '',
            VersionDate: '',
            Description: '',
            PR_No: '',
            PO_No: '',
            CylinderCompany: '',
            PrintingCompany: '',
          });
        }
      });

      this.excelService.exportAsExcelFile(exportData, 'ProductList');
    });
}

  exportToExcel(query: string) {
    this.productService
      .getAllProducts(
        query,
        0,
        10000000,
        this.categoryid,
        this.filtered_brand,
        this.filtered_flavourtype,
        this.filtered_origin,
        this.filtered_sku,
        this.packtypeid,
        this.cylindercompanyid,
        this.printingcompanyid
      )
      .subscribe((products) => {
        const exportData = products.map((p) => ({
          Category: p.category.name,
          Brand: p.brand,
          Flavour: p.flavourType,
          Origin: p.origin,
          SKU: p.sku,
          ProductCode: p.productCode,
          PackType: p.packType.name,
          BarCode: p.barcode,
          ProjectDate: p.projectDate
            ? new Date(p.projectDate).toISOString().slice(0, 10)
            : '',
          CylinderCompany: p.cylinderCompany.name,
          PrintingCompany: p.printingCompany.name,
          ProductVersions:
            p.productVersions
              ?.map((v) => v.version + ' [' + v.versionDate + ']')
              .join(', ') || '',
        }));

        this.excelService.exportAsExcelFile(exportData, 'ProductList');
      });
  }

  onPageClick(page: number | string) {
    if (typeof page === 'number') {
      this.getPage(page);
    }
  }

  get totalPages(): number {
    //return Math.ceil(this.page_list.length / this.pageSize);
    return Math.ceil(this.page_list.length);
  }

  get smartPageList(): (number | string)[] {
    const maxButtons = 5;
    const total = this.totalPages;
    const current = this.pageNumber;
    const pages: (number | string)[] = [];

    if (total <= maxButtons + 2) {
      // Show all pages if few enough
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Leading ellipsis
    if (current > 3) {
      pages.push('...');
    }

    // Center pages
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Trailing ellipsis
    if (current < total - 2) {
      pages.push('...');
    }

    // Always show last page
    pages.push(total);

    return pages;
  }

  onResetFilters() {
    this.pageNumber = 1;
    this.pageSize = 50;
    this.categoryid = [];
    this.filtered_brand = [];
    this.filtered_flavourtype = [];
    this.filtered_origin = [];
    this.filtered_sku = [];
    this.packtypeid = [];
    this.cylindercompanyid = [];
    this.printingcompanyid = [];
    this.queryText.nativeElement.value = '';
    this.selectPageSize.nativeElement.selectedIndex = 0;
    this.onSearch('');
  }

  onFilterBrand(query: string): void {
    console.log(query);
  }

  onSearch(query: string) {
    this.products$ = this.productService.getAllProducts(
      query,
      this.pageNumber,
      this.pageSize,
      this.categoryid,
      this.filtered_brand,
      this.filtered_flavourtype,
      this.filtered_origin,
      this.filtered_sku,
      this.packtypeid,
      this.cylindercompanyid,
      this.printingcompanyid
    );

    // load brands
    console.log('Selected Categories: ' + this.categoryid);
    if (this.categoryid) {
      this.brands$ = this.suggestionService.getSuggestionsBrand(
        '%',
        this.categoryid
      );

      this.brands$.subscribe((brands) => {
        console.log('Category Filter Added : Brands ->', brands);
      });
    }

    // load flavoour type
    console.log('Selected Brands: ' + this.filtered_brand);
    if (this.categoryid || this.filtered_brand) {
      this.flavourtypes$ = this.suggestionService.getSuggestionsFlavourType(
        '%',
        this.categoryid,
        this.filtered_brand
      );

      this.flavourtypes$.subscribe((flavourtype) => {
        console.log('Filtered: Flavour Types ->', flavourtype);
      });
    }

    // load origin
    console.log('Selected Flavours: ' + this.filtered_flavourtype);
    if (this.categoryid || this.filtered_brand || this.filtered_flavourtype) {

      this.origins$ = this.suggestionService.getSuggestionsOrigin('%',
        this.categoryid,
        this.filtered_brand,
        this.filtered_flavourtype);

      this.origins$.subscribe((origin) => {
        console.log('Filtered: Origins ->', origin);
      });

    }

    // load SKU
    console.log('Selected Origins: ' + this.filtered_origin);
    if (this.categoryid || this.filtered_brand || this.filtered_flavourtype || this.filtered_origin) {
      this.skus$ = this.suggestionService.getSuggestionsSKU('%', this.categoryid,
        this.filtered_brand,
        this.filtered_flavourtype, this.filtered_origin);

      this.skus$.subscribe((sku) => {
        console.log('Filtered: SKU ->', sku);
      });
    }

    this.global_query = query;

    this.productService
      .getProductCount(
        query,
        this.categoryid,
        this.filtered_brand,
        this.filtered_flavourtype,
        this.filtered_origin,
        this.filtered_sku,
        this.packtypeid,
        this.cylindercompanyid,
        this.printingcompanyid
      )
      .subscribe({
        next: (value) => {
          this.totalProductCount = value;
          this.page_list = new Array(
            Math.ceil(this.totalProductCount / this.pageSize)
          );
        },
      });
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.products$ = this.productService.getAllProducts(
      this.global_query,
      pageNumber,
      this.pageSize,
      this.categoryid,
      this.filtered_brand,
      this.filtered_flavourtype,
      this.filtered_origin,
      this.filtered_sku,
      this.packtypeid,
      this.cylindercompanyid,
      this.printingcompanyid
    );
  }

  loadData() {
    console.log('data reloaded');

    this.products$ = this.productService.getAllProducts(
      this.global_query,
      this.pageNumber,
      this.pageSize,
      this.categoryid,
      this.filtered_brand,
      this.filtered_flavourtype,
      this.filtered_origin,
      this.filtered_sku,
      this.packtypeid,
      this.cylindercompanyid,
      this.printingcompanyid
    );
  }

  getPrevPage() {
    if (this.pageNumber - 1 < 1) {
      return;
    }

    this.pageNumber -= 1;
    this.getPage(this.pageNumber);
  }

  getNextPage() {
    if (this.pageNumber + 1 > this.page_list.length) {
      return;
    }

    this.pageNumber += 1;
    this.getPage(this.pageNumber);
  }

  onPageSizeChange(value: string) {
    this.pageSize = Number(value);
  }

  openViewProduct(productid: number) {
    this.dialog.open(ViewProductComponent, {
      width: '70vw', // or '1000px' or '95%' — your choice
      maxWidth: '75vw', // prevents Angular Material default max width (80vw)
      data: { productid },
    });
  }

  openProductVersionModal(productid: number) {
    const dialogRef = this.dialog.open(AddProductversionComponent, {
      width: '70vw', // or '1000px' or '95%' — your choice
      maxWidth: '75vw', // prevents Angular Material default max width (80vw)
      data: { productid },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData(); // 👈 Call your data-loading method here
      }
    });
  }

  showAddProductModal(){
    this.dialog.open(AddProductComponent, {
      width: '70vw', // or '1000px' or '95%' — your choice
      maxWidth: '80vw', // prevents Angular Material default max width (80vw)
      height: '80vh',
      data: { },
    });
  }

  openShowProductVersionModal(productversionid: number) {
    console.log('tester : ' + productversionid.toString());
    this.dialog.open(ShowProductversionComponent, {
      width: '70vw', // or '1000px' or '95%' — your choice
      maxWidth: '80vw', // prevents Angular Material default max width (80vw)
      height: '80vh',
      data: { productversionid },
    });
  }

  deleteProductVersion(productversionid: number) {
    this.isShowProductVersionModalVisible = false;

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
        this.deleteProductVersionSubscription = this.productVersionService
          .deleteProductVersion(productversionid)
          .subscribe({
            next: (response) => {
              Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
              this.loadData();
            },
            error: (error) => {
              ToastrUtils.showErrorToast('Not Authorized To Delete!');
            },
          });
      } else {
        console.log('Delete operation cancelled.');
      }
    });
  }

  closeProductVersionModal() {
    this.isProductVersionModalVisible = false;
  }

  closeShowProductVersionModal() {
    this.isShowProductVersionModalVisible = false;
  }
}
