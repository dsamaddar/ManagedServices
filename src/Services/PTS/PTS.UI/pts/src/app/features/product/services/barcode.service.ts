import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddBarCodeRequest } from '../models/barcode.model';
import { Observable } from 'rxjs';
import { BarCodes } from '../../barcode/models/barcode.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor(private http: HttpClient) { }

    AddBarCode(model: AddBarCodeRequest): Observable<BarCodes> {
      return this.http.post<BarCodes>(
        `${environment.apiBaseUrl}/api/barcode`,
        model
      );
    }
}
