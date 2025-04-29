import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { AddPackTypeRequest } from '../models/add-packtype-request.model';
import { Observable } from 'rxjs';
import { PackType } from '../models/packtype.model';
import { UpdatePackTypeRequest } from '../models/update-packtype-request.model';

@Injectable({
  providedIn: 'root'
})
export class PacktypeService {

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  addPackType(model: AddPackTypeRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/packtype`,
      model
    );
  }

  getAllPackTypes(): Observable<PackType[]> {
    return this.http.get<PackType[]>(
      `${environment.apiBaseUrl}/api/packtype`
    );
  }

  getPackTypeById(id: number): Observable<PackType> {
    return this.http.get<PackType>(
      `${environment.apiBaseUrl}/api/packtype/${id}`
    );
  }

  updatePackType(
    id: number,
    updateCategoryRequest: UpdatePackTypeRequest
  ): Observable<PackType> {
    return this.http.put<PackType>(
      `${environment.apiBaseUrl}/api/packtype/${id}`,
      updateCategoryRequest
    );
  }

  deleteCategory(id: number): Observable<PackType> {
    return this.http.delete<PackType>(
      `${environment.apiBaseUrl}/api/Categories/${id}`
    );
  }
}
