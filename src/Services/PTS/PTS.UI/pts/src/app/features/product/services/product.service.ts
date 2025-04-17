import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddProductRequest } from '../models/add-product.model';
import { Product } from '../models/product.model';
import { AllProduct } from '../models/all-product.model';
import { Attachment } from '../models/attachment.model';

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

  getAllProducts(): Observable<AllProduct[]> {
    return this.http.get<AllProduct[]>(`${environment.apiBaseUrl}/api/product`);
  }

  getProductById(id: number): Observable<AllProduct> {
    return this.http.get<AllProduct>(
      `${environment.apiBaseUrl}/api/product/${id}`
    );
  }

  getAttachmentsByProductId(productId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(
      `${environment.apiBaseUrl}/api/attachment/${productId}`
    );
  }

  uploadAttachment(
    files: File[],
    productid: string
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file)); // 'files' should match the backend parameter name

    formData.append('productid', productid);

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
}
