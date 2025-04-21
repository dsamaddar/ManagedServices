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

    addProject(model: AddProductCodeRequest): Observable<void>{
      return this.http.post<void>(`${environment.apiBaseUrl}/api/productcode`,model);
    }

    getProjectById(id: number): Observable<ProductCode>{
      return this.http.get<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`);
    }

    updateProject(id: number, updateProjectRequest: UpdateProductCodeRequest): Observable<ProductCode>{
      return this.http.put<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`, updateProjectRequest);
    }

    deleteProject(id:number):Observable<ProductCode>{
      return this.http.delete<ProductCode>(`${environment.apiBaseUrl}/api/productcode/${id}`);
    }

}
