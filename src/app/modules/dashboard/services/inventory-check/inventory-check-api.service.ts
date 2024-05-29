import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryCheckService } from './inventory-check.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { InventoryCheck } from '../../models/inventory-check';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryCheckApiService {
  private apiUrl: string = environment.apiUrl + 'inventory-check';

  constructor(
    private http: HttpClient,
    private inventoryCheckService: InventoryCheckService
  ) {}

  getAll(): Observable<InventoryCheck[]> {
    return this.http.get<InventoryCheck[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryCheckService.assign(res))
    );
  }

  getByYear(year: number): Observable<InventoryCheck[]> {
    return this.http.get<InventoryCheck[]>(`${this.apiUrl}/year/${year}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryCheckService.assign(res))
    );
  }

  getById(id: number): Observable<InventoryCheck> {
    return this.http.get<InventoryCheck>(`${this.apiUrl}/id/${id}`);
  }

  create(inventoryId: number): Observable<ApiResponse<InventoryCheck>> {
    return this.http
      .post<ApiResponse<InventoryCheck>>(this.apiUrl, { inventoryId })
      .pipe(
        tap((res) => {
          const inventoryCheck = this.inventoryCheckService.getByInventoryId(
            res.item.Inventory.id
          );
          if (!inventoryCheck) this.inventoryCheckService.create(res.item);
        })
      );
  }
}
