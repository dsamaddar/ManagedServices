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
    pageSize?: number
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

  getProductCount(query?: string): Observable<number> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
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
