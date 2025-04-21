import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCode } from '../models/productcode.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AddProductCodeRequest } from '../models/add-productcode-request.model';
import { UpdateProductCodeRequest } from '../models/update-productcode-request.model';
import { Product } from '../../product/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductCodeService {

  constructor(private http: HttpClient) {}

    getAllProjects(): Observable<ProductCode[]> {
      return this.http.get<ProductCode[]>(
        `${environment.apiBaseUrl}/api/productcode`
      );
    }

    addProductCode(model: AddProductCodeRequest): Observable<void>{
      return this.http.post<void>(`${environment.apiBaseUrl}/api/productcode`,model);
    }

    getProductCodeById(id: number): Observable<ProductCode>{
      return this.http.get<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`);
    }

    updateProductCode(id: number, updateProjectRequest: UpdateProductCodeRequest): Observable<ProductCode>{
      return this.http.put<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`, updateProjectRequest);
    }

    deleteProductCode(id:number):Observable<ProductCode>{
      return this.http.delete<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`);
    }

}
