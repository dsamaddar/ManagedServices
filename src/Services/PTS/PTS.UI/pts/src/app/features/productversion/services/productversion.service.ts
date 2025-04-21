import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddProductVersion } from '../models/add-productversion.model';
import { ProductVersion } from '../models/productversion.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductversionService {
  constructor(private http: HttpClient) {}

  addProductVersion(model: AddProductVersion): Observable<ProductVersion> {
    return this.http.post<ProductVersion>(
      `${environment.apiBaseUrl}/api/productversion`,
      model
    );
  }
}
