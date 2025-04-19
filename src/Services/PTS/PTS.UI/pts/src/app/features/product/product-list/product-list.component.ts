import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { map, Observable } from 'rxjs';
import { AllProduct } from '../models/all-product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule],
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getAllProducts(undefined, this.pageNumber,this.pageSize);
    
    this.productService.getProductCount(undefined)
    .subscribe({
      next: (value) => {
        this.totalProductCount = value;
        this.page_list = new Array(Math.ceil(this.totalProductCount/this.pageSize));
        console.log('Number of products:', this.totalProductCount);
      }
    });

    /*
    this.products$?.subscribe(products => {
      this.totalProductCount = products.length;

      this.page_list = new Array(Math.ceil(this.totalProductCount/this.pageSize));

      console.log('Number of products:', this.totalProductCount);
    });
    */

  }

  onSearch(query: string){
    this.products$ = this.productService.getAllProducts(query, this.pageNumber,this.pageSize);
    
    this.global_query = query;

    this.productService.getProductCount(query)
    .subscribe({
      next: (value) => {
        this.totalProductCount = value;
        this.page_list = new Array(Math.ceil(this.totalProductCount/this.pageSize));
        console.log('Number of products:', this.totalProductCount);
      }
    });
    /*
    this.products$?.subscribe(products => {
      this.totalProductCount = products.length;
      console.log('Number of products:', this.totalProductCount);
    });
    */
  }

  getPage(pageNumber: number){
    console.log(pageNumber);
    this.pageNumber = pageNumber;
    this.products$ = this.productService.getAllProducts(this.global_query, pageNumber,this.pageSize);
  }

  getPrevPage(){

    if(this.pageNumber - 1 < 1){
      return;
    }

    this.pageNumber -= 1;
    this.getPage(this.pageNumber);
  }

  getNextPage(){
    if(this.pageNumber + 1 > this.page_list.length){
      return;
    }

    this.pageNumber += 1;
    this.getPage(this.pageNumber);
  }

  onPageSizeChange(value: string){
    this.pageSize = Number(value);
  }

}
