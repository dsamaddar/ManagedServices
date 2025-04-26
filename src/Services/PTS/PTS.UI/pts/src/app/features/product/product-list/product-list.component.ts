import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { map, Observable, Subscribable, Subscription } from 'rxjs';
import { AllProduct } from '../models/all-product.model';
import { AddProductversionComponent } from '../../../shared/components/add-productversion/add-productversion.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProductversionService } from '../../productversion/services/productversion.service';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { ShowProductversionComponent } from "../../../shared/components/show-productversion/show-productversion.component";

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AddProductversionComponent,
    ShowProductversionComponent
],
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
  product_version_id: number = 0;

  private deleteProductVersionSubscription?: Subscription;

  isProductVersionModalVisible: boolean = false;
  isShowProductVersionModalVisible: boolean = false;

  constructor(
    private productService: ProductService,
    private productVersionService: ProductversionService,
    private router: Router
  ) {}

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

  openProductVersionModal(productid: number) {
    //console.log('Transferred ID ->' + productid.toString());
    this.master_product_id = productid;
    this.isProductVersionModalVisible = true;
  }

  openShowProductVersionModal(productversionid: number) {
    console.log('Product Version ID ->' + productversionid.toString());
    this.product_version_id = productversionid;
    this.isShowProductVersionModalVisible = true;
  }

  deleteProductVersion(productversionid: number) {

    this.isShowProductVersionModalVisible = false;
    /*
    if(this.isShowProductVersionModalVisible == true){
      console.log('showing is true');
    }
    this.closeShowProductVersionModal();
    */

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
                //this.router.navigateByUrl('/admin/products');
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
