import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  AddCategory(model: AddCategoryRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/Categories`,
      model,
      {
        headers: {
          Authorization: this.cookieService.get('Authorization'),
        },
      }
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.apiBaseUrl}/api/Categories`,
      {
        headers: {
          Authorization: this.cookieService.get('Authorization'),
        },
      }
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${environment.apiBaseUrl}/api/Categories/${id}`,
      {
        headers: {
          Authorization: this.cookieService.get('Authorization'),
        },
      }
    );
  }

  updateCategory(
    id: number,
    updateCategoryRequest: UpdateCategoryRequest
  ): Observable<Category> {
    return this.http.put<Category>(
      `${environment.apiBaseUrl}/api/Categories/${id}`,
      updateCategoryRequest,
      {
        headers: {
          Authorization: this.cookieService.get('Authorization'),
        },
      }
    );
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(
      `${environment.apiBaseUrl}/api/Categories/${id}`,
      {
        headers: {
          Authorization: this.cookieService.get('Authorization'),
        },
      }
    );
  }
}
