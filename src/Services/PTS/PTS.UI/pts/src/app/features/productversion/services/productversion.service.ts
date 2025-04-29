import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddProductVersionRequest } from '../models/add-productversion.model';
import { ProductVersion } from '../models/productversion.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
