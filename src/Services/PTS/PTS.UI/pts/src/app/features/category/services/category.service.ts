import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  AddCategory(model: AddCategoryRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/Categories`,
      model
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.apiBaseUrl}/api/Categories`
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${environment.apiBaseUrl}/api/Categories/${id}`
    );
  }

  updateCategory(
    id: number,
    updateCategoryRequest: UpdateCategoryRequest
  ): Observable<Category> {
    return this.http.put<Category>(
      `${environment.apiBaseUrl}/api/Categories/${id}`,
      updateCategoryRequest
    );
  }
}
