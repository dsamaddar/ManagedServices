import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  constructor(private http: HttpClient) {}

  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/suggestions?search=${query}`);
  }
}
