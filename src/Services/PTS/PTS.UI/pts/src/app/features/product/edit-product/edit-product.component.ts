import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { AllProduct } from '../models/all-product.model';
import { Category } from '../../category/models/category.model';
import { Project } from '../../project/models/project.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { CategoryService } from '../../category/services/category.service';
import { ProjectService } from '../../project/services/project.service';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FileSelectorComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit, OnDestroy {
  
  id?: number = 0;
  paramsSubscription?: Subscription;
  editProductSubscription?: Subscription;
  deleteProductSubscription?: Subscription;
  product?: AllProduct;

  progress = 0;
    //product: AddProductRequest;
  selectedFiles: File[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  projects$?: Observable<Project[]>;
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
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private datepipe: DatePipe,
    private http: HttpClient
  )
  {}

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

  
  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();
    this.projects$ = this.projectService.getAllProjects();
    this.cylinderCompanies$ =
      this.cylinderCompanyService.getAllCylinderCompanies();
    this.printingCompanies$ =
      this.printingCompanyService.getAllPrintingCompanies();

    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if(this.id){
          // get the data from the api for this category id
          this.productService.getProductById(this.id)
          .subscribe({
            next: (response) => {
              this.product = response;
            }
          });
        }
      }
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

  onFormSubmit() {}

}
