import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PackType } from '../../packtype/models/packtype.model';
import { PacktypeListComponent } from '../../packtype/packtype-list/packtype-list.component';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private http: HttpClient) {}

  getSuggestionsBrand(
    query: string,
    categoryId?: number[]
  ): Observable<string[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((id) => {
        params = params.append('categoryId', id);
      });
    }

    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-brand`,
      { params }
    );
  }

  getSuggestionsFlavourType(
    query: string,
    categoryId?: number[],
    brand?: string[]
  ): Observable<string[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((id) => {
        params = params.append('categoryId', id);
      });
    }

    if (brand && brand.length > 0) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-flavourtype`,
      { params }
    );
  }

  getSuggestionsOrigin(
    query: string,
    categoryId?: number[],
    brand?: string[],
    flavour?: string[]
  ): Observable<string[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((id) => {
        params = params.append('categoryId', id);
      });
    }

    if (brand && brand.length > 0) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    if (flavour && flavour.length > 0) {
      flavour.forEach((flavour) => {
        params = params.append('flavour', flavour);
      });
    }

    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-origin`,
      { params }
    );
  }

  getSuggestionsSKU(
    query: string,
    categoryId?: number[],
    brand?: string[],
    flavour?: string[],
    origin?: string[]
  ): Observable<string[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((id) => {
        params = params.append('categoryId', id);
      });
    }

    if (brand && brand.length > 0) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    if (flavour && flavour.length > 0) {
      flavour.forEach((flavour) => {
        params = params.append('flavour', flavour);
      });
    }

    if (origin && origin.length > 0) {
      origin.forEach((origin) => {
        params = params.append('origin', origin);
      });
    }

    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-sku`,
      { params }
    );
  }

  getSuggestionsPackTypes(
    query: string,
    categoryId?: number[],
    brand?: string[],
    flavour?: string[],
    origin?: string[],
    sku?: string[],
  ): Observable<PackType[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((id) => {
        params = params.append('categoryId', id);
      });
    }

    if (brand && brand.length > 0) {
      brand.forEach((brand) => {
        params = params.append('brand', brand);
      });
    }

    if (flavour && flavour.length > 0) {
      flavour.forEach((flavour) => {
        params = params.append('flavour', flavour);
      });
    }

    if (origin && origin.length > 0) {
      origin.forEach((origin) => {
        params = params.append('origin', origin);
      });
    }

    if (sku && sku.length > 0) {
      sku.forEach((sku) => {
        params = params.append('sku', sku);
      });
    }

    return this.http.get<PackType[]>(
      `${environment.apiBaseUrl}/api/packtype/suggestions-packtype`,
      { params }
    );
  }

  getSuggestionsVersion(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-version?query=${query}`
    );
  }

  getIsVersionUnique(query: string): Observable<boolean> {
    return this.http
      .get<{ isUnique: boolean }>(
        `${environment.apiBaseUrl}/api/product/is-version-unique?query=${query}`
      )
      .pipe(map((response) => response.isUnique));
  }

  getIsProductCodeUnique(query: string): Observable<boolean> {
    return this.http
      .get<{ isUnique: boolean }>(
        `${environment.apiBaseUrl}/api/product/is-productcode-unique?query=${query}`
      )
      .pipe(map((response) => response.isUnique));
  }

  getIsBarCodeUnique(query: string): Observable<boolean> {
    return this.http
      .get<{ isUnique: boolean }>(
        `${environment.apiBaseUrl}/api/product/is-barcode-unique?query=${query}`
      )
      .pipe(map((response) => response.isUnique));
  }

  getSuggestionsProductCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-productcode?query=${query}`
    );
  }

  getSuggestionsBarCode(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/api/product/suggestions-barcode?query=${query}`
    );
  }
}
