import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddProductVersionRequest } from '../models/add-productversion.model';
import { ProductVersion } from '../models/productversion.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UpdateProductVersionRequest } from '../models/update-productversion-request.model';

@Injectable({
  providedIn: 'root',
})
export class ProductversionService {
  constructor(private http: HttpClient) {}

  addProductVersion(
    model: AddProductVersionRequest
  ): Observable<ProductVersion> {
    return this.http.post<ProductVersion>(
      `${environment.apiBaseUrl}/api/productversion`,
      model
    );
  }

  updateProductVersion(
    id: number,
    productVersion: ProductVersion
  ): Observable<ProductVersion> {
    return this.http.put<ProductVersion>(
      `${environment.apiBaseUrl}/api/productversion/update-productversion-mini/${id}`,
      productVersion
    );
  }

  getProdVersionsByProdId(id: number): Observable<ProductVersion[]> {
    return this.http.get<ProductVersion[]>(
      `${environment.apiBaseUrl}/api/ProductVersion/showprodversionbyprodid/${id}`
    );
  }

  deleteProductVersion(id: number): Observable<ProductVersion> {
    return this.http.delete<ProductVersion>(
      `${environment.apiBaseUrl}/api/productversion/${id}`
    );
  }
}
