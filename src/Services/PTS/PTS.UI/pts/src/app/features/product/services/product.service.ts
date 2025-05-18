import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpEventType,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddProductRequest } from '../models/add-product.model';
import { Product } from '../models/product.model';
import { AllProduct } from '../models/all-product.model';
import { Attachment } from '../models/attachment.model';
import { UpdateProductRequest } from '../models/edit-product.model';
import { ProductVersion } from '../../productversion/models/productversion.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  AddProduct(model: AddProductRequest): Observable<Product> {
    return this.http.post<Product>(
      `${environment.apiBaseUrl}/api/product`,
      model
    );
  }

  updateProduct(
    id: number,
    updateProductRequest: UpdateProductRequest
  ): Observable<Product> {
    return this.http.put<Product>(
      `${environment.apiBaseUrl}/api/product/${id}`,
      updateProductRequest
    );
  }

  getAllProducts(
    query?: string,
    pageNumber?: number,
    pageSize?: number,
    categoryid?: number[],
    brand?: string[],
    flavour?: string[],
    origin?: string[],
    sku?: string[],
    packtypeid?: number[],
    cylindercompanyid?: number[],
    printingcompanyid?: number[]
  ): Observable<AllProduct[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }

    if (categoryid) {
      categoryid.forEach((id) => {
        params = params.append('categoryid', id);
      });
    }

        if (brand) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    if (flavour) {
      flavour.forEach((flavour) => {
        params = params.set('flavour', flavour);
      });
    }

    if (origin) {
      origin.forEach((origin) => {
        params = params.set('origin', origin);
      });
    }

    if (sku) {
      sku.forEach((sku) => {
        params = params.set('sku', sku);
      });
    }

    if (packtypeid) {
      packtypeid.forEach((id) => {
        params = params.set('packtypeid', id);
      });
    }

    if (cylindercompanyid) {
      cylindercompanyid.forEach((id) => {
        params = params.set('cylindercompanyid', id);
      });
    }

    if (printingcompanyid) {
      printingcompanyid.forEach((id) => {
        params = params.set('printingcompanyid', id);
      });
    }

    return this.http.get<AllProduct[]>(
      `${environment.apiBaseUrl}/api/product`,
      {
        params: params,
      }
    );
  }

  getProductById(id: number): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/product/${id}`
    );
  }

  getProductByBarCode(barcode: string): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/product/product-barcode/${barcode}`
    );
  }

  getProductByProductCode(productcode: string): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/product/product-productcode/${productcode}`
    );
  }

  getProductByVersion(version: string): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/product/product-version/${version}`
    );
  }

  getProductByProductVersionId(id: number): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/productversion/showproductversiondetail/${id}`
    );
  }

  updateProductVersionInfo(id: number, prNo: string, poNo: string): Observable<ProductVersion> {
    const body = { prNo, poNo };
  
    return this.http.put<ProductVersion>(
      `${environment.apiBaseUrl}/api/productversion/updateproductversion/${id}`,
      body
    );
  }

  getProductCount(
    query?: string,
    categoryid?: number[],
    brand?: string[],
    flavour?: string[],
    origin?: string[],
    sku?: string[],
    packtypeid?: number[],
    cylindercompanyid?: number[],
    printingcompanyid?: number[]
  ): Observable<number> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    if (categoryid) {
      categoryid.forEach((id) => {
        params = params.append('categoryid', id);
      });
    }

    if (brand) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    if (flavour) {
      flavour.forEach((flavour) => {
        params = params.set('flavour', flavour);
      });
    }

    if (origin) {
      origin.forEach((origin) => {
        params = params.set('origin', origin);
      });
    }

    if (sku) {
      sku.forEach((sku) => {
        params = params.set('sku', sku);
      });
    }

    if (packtypeid) {
      packtypeid.forEach((id) => {
        params = params.set('packtypeid', id);
      });
    }

    if (cylindercompanyid) {
      cylindercompanyid.forEach((id) => {
        params = params.set('cylindercompanyid', id);
      });
    }

    if (printingcompanyid) {
      printingcompanyid.forEach((id) => {
        params = params.set('printingcompanyid', id);
      });
    }

    return this.http.get<number>(
      `${environment.apiBaseUrl}/api/product/count`,
      {
        params: params,
      }
    );
  }

  getAttachmentsByProductId(productId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(
      `${environment.apiBaseUrl}/api/attachment/${productId}`
    );
  }

  uploadAttachment(
    files: File[],
    productVersionId: string
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file)); // 'files' should match the backend parameter name

    formData.append('productVersionId', productVersionId);

    return this.http.post<Product>(
      `${environment.apiBaseUrl}/api/attachment/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  deleteAttachment(id: number): Observable<Attachment> {
    return this.http.delete<Attachment>(
      `${environment.apiBaseUrl}/api/attachment/${id}`
    );
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(
      `${environment.apiBaseUrl}/api/product/${id}`
    );
  }


}
