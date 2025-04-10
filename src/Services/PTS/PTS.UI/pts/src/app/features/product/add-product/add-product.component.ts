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
    DatePipe
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit, OnDestroy {
  
  product: AddProductRequest;
  

  // observable array
  categories$?: Observable<Category[]>;
  cylinderCompanies$?: Observable<CylinderCompany[]>;
  printingCompanies$?: Observable<PrintingCompany[]>;

  constructor(
    private categoryService: CategoryService,
    private cylinderCompanyService: CylindercompanyService,
    private printingCompanyService: PrintingcompanyService,
    private router: Router,
    private datepipe: DatePipe
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

  onFormSubmit() {
    this.product.categoryid = this.categoryid || 0;
    this.product.cylindercompanyid = this.cylindercompanyid || 0;
    this.product.printingcompanyid = this.printingcompanyid || 0;
    
    console.log(this.product);
  }
}
