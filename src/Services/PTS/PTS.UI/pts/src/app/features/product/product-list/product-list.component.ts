import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { map, Observable } from 'rxjs';
import { AllProduct } from '../models/all-product.model';
import { AddProductversionComponent } from "../../../shared/components/add-productversion/add-productversion.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule, AddProductversionComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products$?: Observable<AllProduct[]>;
  totalProductCount?: number;
  page_list: number[] = [];
  pageNumber = 1;
  pageSize = 5;
  global_query?: string;
  master_product_id: number = 0;

  isProductVersionModalVisible: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
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
        //console.log('Number of products:', this.totalProductCount);
      },
    });
  }

  onSearch(query: string) {
    this.products$ = this.productService.getAllProducts(
      query,
      this.pageNumber,
      this.pageSize
    );

    this.global_query = query;

    this.productService.getProductCount(query).subscribe({
      next: (value) => {
        this.totalProductCount = value;
        this.page_list = new Array(
          Math.ceil(this.totalProductCount / this.pageSize)
        );
        console.log('Number of products:', this.totalProductCount);
      },
    });
    /*
    this.products$?.subscribe(products => {
      this.totalProductCount = products.length;
      console.log('Number of products:', this.totalProductCount);
    });
    */
  }

  getPage(pageNumber: number) {
    console.log(pageNumber);
    this.pageNumber = pageNumber;
    this.products$ = this.productService.getAllProducts(
      this.global_query,
      pageNumber,
      this.pageSize
    );
  }

  loadData() {
    console.log('data reloaded');
    
    this.products$ = this.productService.getAllProducts(
      this.global_query,
      this.pageNumber,
      this.pageSize
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

  openProductVersionModal(productid: number){
    //console.log('Transferred ID ->' + productid.toString());
    this.master_product_id = productid;
    this.isProductVersionModalVisible = true;
  }

  showProductVersionModal(productversionid: number){
    console.log(productversionid);
  }

  closeProductVersionModal(){
    this.isProductVersionModalVisible = false;
  }

}
