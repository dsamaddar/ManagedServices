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
import { Observable } from 'rxjs';
import { AddCategoryRequest } from '../../category/models/add-category-request.model';
import { CylinderCompany } from '../../cylinderCompany/models/CylinderCompany.model';
import { PrintingCompany } from '../../printingCompany/models/printingcompany.model';
import { CylindercompanyService } from '../../cylinderCompany/services/cylindercompany.service';
import { PrintingcompanyService } from '../../printingCompany/services/printingcompany.service';
import { NumericLiteral } from 'typescript';
import { Product } from '../models/product.model';
import { AddProductRequest } from '../models/add-product.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

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
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit, OnDestroy {
  
  product: AddProductRequest;
  selectedFiles: File[] = [];

  // observable array
  categories$?: Observable<Category[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  iconList = [ // array of icon class list based on type
    { type: "docx", icon: "fas fa-file-word" },
    { type: "xlsx", icon: "fas fa-file-excel" },
    { type: "pdf", icon: "fas fa-file-pdf" },
    { type: "jpg", icon: "fas fa-file-image" }
  ];

  constructor(
    private categoryService: CategoryService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private router: Router,
    private datepipe: DatePipe,
    private http: HttpClient
  ) {
    const myDate = new Date();
    const formatted = this.datepipe.transform(myDate, 'yyyy-MM-dd');
    
      this.product = {
        categoryid: 0,
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
      }
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  categoryid?: number;
  cylindercompanyid?: number;
  printingcompanyid?: number;

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
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

  getFileExtension(filename : string) : string { 
    let ext = filename.split(".").pop();
    console.log(ext);
    let obj = this.iconList.filter(row =>
      {
        if (row.type === ext) {
          return true;
        }

        return "";
      });
    //console.log(obj);

    if (obj.length > 0) {
      let icon = obj[0].icon;
      console.log(icon);
      return icon;
    } 
    else {
      console.log('not found');
      return "";
    }
  }

  onFormSubmit() {
    this.product.categoryid = this.categoryid || 0;
    this.product.cylindercompanyid = this.cylindercompanyid || 0;
    this.product.printingcompanyid = this.printingcompanyid || 0;

    console.log(this.product);

    if (this.selectedFiles.length === 0) return;

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file); // Use 'files[]' if backend expects array
    });

    this.http.post('https://your-api.com/upload', formData).subscribe({
      next: (res) => console.log('Files uploaded!', res),
      error: (err) => console.error('Upload failed:', err),
    });

  }
}
