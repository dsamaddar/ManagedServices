import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddCategoryRequest } from '../models/add-category-request.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {  }

  AddCategory(model: AddCategoryRequest): Observable<void>{
    return this.http.post<void>('https://localhost:5102/api/Categories', model);
  }

}
