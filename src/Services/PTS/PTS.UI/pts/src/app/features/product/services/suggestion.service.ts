import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  constructor(private http: HttpClient) {}

  getSuggestionsBrand(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-brand?query=${query}`);
  }

  getSuggestionsFlavourType(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-flavourtype?query=${query}`);
  }

  getSuggestionsOrigin(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-origin?query=${query}`);
  }

  getSuggestionsSKU(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-sku?query=${query}`);
  }

  getSuggestionsVersion(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-version?query=${query}`);
  }

  getSuggestionsProductCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-productcode?query=${query}`);
  }

  getSuggestionsBarCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-barcode?query=${query}`);
  }

}
