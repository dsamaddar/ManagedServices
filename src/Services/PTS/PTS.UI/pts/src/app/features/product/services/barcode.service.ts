import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddBarCodeRequest } from '../models/add-barcode.model';
import { Observable } from 'rxjs';
import { BarCodes } from '../../barcode/models/barcode.model';
import { environment } from '../../../../environments/environment';
import { DeleteBarCodeRequest } from '../../barcode/models/delbarcode.model';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  constructor(private http: HttpClient) {}

  AddBarCode(model: AddBarCodeRequest): Observable<BarCodes> {
    return this.http.post<BarCodes>(
      `${environment.apiBaseUrl}/api/barcode`,
      model
    );
  }

  getBarCodesByProdId(productId: number): Observable<BarCodes[]> {
    return this.http.get<BarCodes[]>(
      `${environment.apiBaseUrl}/api/barcode/getbarcode-by-product/${productId}`
    );
  }

  deleteBarcodeByName(request: DeleteBarCodeRequest): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/api/barcode/delbarcode-by-name`,
      {
        body: request,
      }
    );
  }
}
