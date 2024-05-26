import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class ScanApiService {
  private apiUrl: string = environment.apiUrl + 'inventory';

  constructor(private http: HttpClient) {}

  getInventoryByCode(code: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/code/${code}`);
  }
}
