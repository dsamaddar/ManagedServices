import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { parseISO, format } from 'date-fns';
import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  NgModel,
  Validators,
} from '@angular/forms';
import { AddProductVersionRequest } from '../../../features/productversion/models/add-productversion.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProductversionService } from '../../../features/productversion/services/productversion.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ProductService } from '../../../features/product/services/product.service';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { Router } from '@angular/router';
import { ProductVersion } from '../../../features/productversion/models/productversion.model';
import { environment } from '../../../../environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SuggestionService } from '../../../features/product/services/suggestion.service';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileSelectorComponent } from '../file-selector/file-selector.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CylinderCompany } from '../../../features/cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../../features/printingCompany/models/printingcompany.model';
import { CylindercompanyService } from '../../../features/cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../../features/printingCompany/services/printingcompany.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PreviewCommonComponent } from '../../../features/product/preview-common/preview-common.component';
import { PreviewVersionComponent } from '../../../features/product/preview-version/preview-version.component';

@Component({
  selector: 'app-add-productversion',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgSelectModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './add-productversion.component.html',
  styleUrl: './add-productversion.component.css',
})
export class AddProductversionComponent implements OnInit, OnDestroy {
  @Input() data_path!: number;
  @Output() refreshParent = new EventEmitter<void>();
  progress = 0;

  msg_error: string = '';
  msg_warning: string = '';
  msg_info: string = '';

  productVersion!: AddProductVersionRequest;
  prevProdVersions: ProductVersion[] = [];
  selectedFiles: File[] = [];
  attachmentBaseUrl?: string;

  isVersionUnique: boolean | null = null;
  ngForm: FormGroup;

  private addProductVersionSubscription?: Subscription;
  private addAttachmentsSubscripts?: Subscription;
  private uploadAttachmentSubscription?: Subscription;

  private searchVersions = new Subject<string>();
  suggestions_version: string[] = [];

  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;
  cylindercompanyid?: number;
  printingcompanyid?: number;

  myDate = new Date();

  constructor(
    private datepipe: DatePipe,
    private productVersionService: ProductversionService,
    private productService: ProductService,
    private suggestionService: SuggestionService,
    private router: Router,
    private fb: FormBuilder,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private dialogRef: MatDialogRef<AddProductversionComponent>,
    private overlay: Overlay,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    @Inject(MAT_DIALOG_DATA) public data: { productid: number }
  ) {
    console.log(this.data.productid);

    this.ngForm = this.fb.group({
      version: ['', Validators.required],
      versionDate: [this.myDate, Validators.required],
    });
  }

  ngOnInit(): void {
    this.attachmentBaseUrl = `${environment.attachmentBaseUrl}`;

    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();

    const formatted = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');

    this.productVersion = {
      version: '',
      versionDate: this.myDate || '',
      description: '',
      cylinderPrNo: '',
      cylinderPoNo: '',
      printingPrNo: '',
      printingPoNo: '',
      productId: this.data.productid,
      cylinderCompanyId: null,
      printingCompanyId: null,
      userId: String(localStorage.getItem('user-id')),
    };

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

    this.getPrevProductVersions(this.data.productid);
  }

  close() {
    this.dialogRef.close(true);
  }

  checkVersionUnique(control: NgModel) {
    const version = this.productVersion.version?.trim().toUpperCase();
    if (!version) return;

    this.suggestionService.getIsVersionUnique(version).subscribe({
      next: (isUnique) => {
        this.isVersionUnique = isUnique;

        if (!isUnique) {
          // Set a custom validation error
          control.control.setErrors({ notUnique: true });
        } else {
          // Clear the custom error
          const errors = control.errors;
          if (errors) {
            delete errors['notUnique'];
            if (Object.keys(errors).length === 0) {
              control.control.setErrors(null);
            } else {
              control.control.setErrors(errors);
            }
          }
        }
      },
    });
  }

  onSearchChangeVersion(value: string) {
    this.hideVersionOverlay();
    this.hideCommonOverlay();

    this.msg_error = '';
    this.msg_info = '';
    this.msg_warning = '';
    const upper = value.toUpperCase();
    this.productVersion.version = upper; // updates ngModel immediately

    console.log('version->' + upper);
    if (value && value.length >= 1) {
      this.searchVersions.next(upper);
      console.log('version->->' + upper);

      this.suggestionService.getIsVersionUnique(upper).subscribe({
        next: (response) => {
          this.isVersionUnique = response;
          if (this.isVersionUnique === false) {
            console.log(this.isVersionUnique);
            this.msg_error =
              'Version Already Exists : ' + this.productVersion.version;
            // ToastrUtils.showErrorToast(
            //   'Version Already Exists : ' + this.productVersion.version
            // );
          }
        },
      });
    } else {
      this.suggestions_version = [];
    }
  }

  onProductVersionDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    if (event.value && this.productVersion) {
      this.productVersion.versionDate = event.value
        ? new Date(format(event.value, 'yyyy-MM-dd'))
        : new Date();
      console.log(this.productVersion.versionDate);
    }

    // if (this.product?.projectDate) {
    //   console.log('setter: ' + value);

    //   this.product.projectDate = value ? new Date(value) : new Date();
    // }
  }

  getPrevProductVersions(productid: number) {
    this.productVersionService.getProdVersionsByProdId(productid).subscribe({
      next: (response) => {
        console.log(response);
        this.prevProdVersions = response;
      },
      error: (error) => {
        ToastrUtils.showErrorToast(error);
      },
    });
  }

  get productVersionDateString(): string {
    return this.productVersion.versionDate.toISOString().split('T')[0];
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

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      this.ngForm.markAllAsTouched();
      this.msg_error = 'Invalid Form: Input All Required Fields';
      return;
    }

    if (form.valid && this.isVersionUnique === false) {
      this.msg_error = 'Version Already Exists.';
      return;
    }

    this.productVersion.cylinderCompanyId = this.cylindercompanyid || null;
    this.productVersion.printingCompanyId = this.printingcompanyid || null;

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

                  ToastrUtils.showToast(
                    'Product version added with attachments'
                  );
                  this.progress = 0;
                  break;
              }
            });
          this.close();
        },
        error: (error) => {
          alert(error);
        },
      });

    // refresh parent component
    this.refreshParent.emit();
  }

  private overlayCommonRef: OverlayRef | null = null;

  showCommonOverlay(event: MouseEvent, header: string, option: any): void {
    this.hideCommonOverlay(); // Close existing
    console.log('common-overlay');
    const dataToPass = {
      header: header,
      content: option,
      meta: { id: 0 },
    };

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

    // this.overlayCommonRef = this.overlay.create({
    //   positionStrategy,
    //   hasBackdrop: false,
    //   scrollStrategy: this.overlay.scrollStrategies.reposition(),
    // });

    this.overlayCommonRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'custom-overlay-panel',
    });

    const injector = Injector.create({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dataToPass }],
      parent: this.injector,
    });

    // 🟢 Delay attachment to come after ng-select DOM updates
    setTimeout(() => {
      const portal = new ComponentPortal(
        PreviewCommonComponent,
        this.viewContainerRef,
        injector
      );
      this.overlayCommonRef!.attach(portal);
    }, 0);
  }

  hideCommonOverlay(): void {
    if (this.overlayCommonRef) {
      this.overlayCommonRef.detach();
      this.overlayCommonRef.dispose();
      this.overlayCommonRef = null;
    }
  }

  onSearch() {
    this.hideCommonOverlay();
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
