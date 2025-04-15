import { HttpClient, HttpEvent, HttpRequest, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddProductRequest } from '../models/add-product.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  AddProduct(model: AddProductRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/product`,
      model
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiBaseUrl}/api/product`
    );
  }

  uploadAttachment(files: File[]): Observable<HttpEvent<any>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file)); // 'files' should match the backend parameter name
  
    return this.http.post<any>(`${environment.apiBaseUrl}/api/attachment/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
