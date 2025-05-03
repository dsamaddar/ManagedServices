import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  getIsVersionUnique(query: string): Observable<boolean> {
    return this.http
      .get<{ isUnique: boolean }>(`${environment.apiBaseUrl}/api/product/is-version-unique?query=${query}`)
      .pipe(map(response => response.isUnique));
  }

  getIsBarCodeUnique(query: string): Observable<boolean> {
    return this.http
      .get<{ isUnique: boolean }>(`${environment.apiBaseUrl}/api/product/is-barcode-unique?query=${query}`)
      .pipe(map(response => response.isUnique));
  }

  getSuggestionsProductCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-productcode?query=${query}`);
  }

  getSuggestionsBarCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/api/product/suggestions-barcode?query=${query}`);
  }

}
