import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCylinderCompanyRequest } from '../models/add-cylindercompany-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CylinderCompany } from '../models/CylinderCompany.model';
import { UpdateCylinderCompanyRequest } from '../models/update-cylindercompany-request.model';

@Injectable({
  providedIn: 'root'
})
export class CylindercompanyService {

  constructor(private http: HttpClient) { 

  }
  
  getAllCylinderCompanies(): Observable<CylinderCompany[]>{
    return this.http.get<CylinderCompany[]>(`${environment.apiBaseUrl}/api/cylindercompany`);
  }

  addCylinderCompany(model: AddCylinderCompanyRequest): Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/cylindercompany`,model);
  }

  getCylinderCompanyById(id: number): Observable<CylinderCompany> {
    return this.http.get<CylinderCompany>(
      `${environment.apiBaseUrl}/api/cylindercompany/${id}`
    );
  }

    updateCylinderCompany(
      id: number,
      updateCylinderCompanyRequest: UpdateCylinderCompanyRequest
    ): Observable<CylinderCompany> {
      return this.http.put<CylinderCompany>(
        `${environment.apiBaseUrl}/api/cylindercompany/${id}`,
        updateCylinderCompanyRequest
      );
    }

  deleteCylinderCompany(id: number): Observable<CylinderCompany>{
      return this.http.delete<CylinderCompany>(`${environment.apiBaseUrl}/api/cylindercompany/${id}`);
    }

}
