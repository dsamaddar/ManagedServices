import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPrintingCompanyRequest } from '../models/add-printingcompany.model';
import { environment } from '../../../../environments/environment';
import { PrintingCompany } from '../models/printingcompany.model';
import { UpdatePrintingCompanyRequest } from '../models/update-printingcompany.model';

@Injectable({
  providedIn: 'root',
})
export class PrintingcompanyService {
  constructor(private http: HttpClient) {}

  AddPrintingCompany(model: AddPrintingCompanyRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/printingcompany`,
      model
    );
  }

  getAllPrintingCompanies(): Observable<PrintingCompany[]> {
    return this.http.get<PrintingCompany[]>(
      `${environment.apiBaseUrl}/api/printingcompany`
    );
  }

  getPrintingCompanyById(id: number): Observable<PrintingCompany> {
    return this.http.get<PrintingCompany>(
      `${environment.apiBaseUrl}/api/printingcompany/${id}`
    );
  }

  updatePrintingCompany(
    id: number,
    updatePrintingCompanyRequest: UpdatePrintingCompanyRequest
  ): Observable<PrintingCompany> {
    return this.http.put<PrintingCompany>(
      `${environment.apiBaseUrl}/api/printingcompany/${id}`,
      updatePrintingCompanyRequest
    );
  }

  deletePrintingCompany(id: number): Observable<PrintingCompany> {
    return this.http.delete<PrintingCompany>(
      `${environment.apiBaseUrl}/api/printingcompany/${id}`
    );
  }
}
