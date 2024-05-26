import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryCheckService } from './inventory-check.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import {
  InCheckPayload,
  InCheckResponse,
  InventoryCheck,
} from '../../models/inventory-check';

@Injectable({
  providedIn: 'root',
})
export class InventoryCheckApiService {
  private apiUrl: string = environment.apiUrl + 'inventory-check';

  constructor(
    private http: HttpClient,
    private inventoryCheckService: InventoryCheckService
  ) {}

  getAllInChecks(): Observable<InventoryCheck[]> {
    return this.http.get<InventoryCheck[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryCheckService.setInChecks(res))
    );
  }

  getInChecksByYear(year: number): Observable<InventoryCheck[]> {
    return this.http.get<InventoryCheck[]>(`${this.apiUrl}/year/${year}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryCheckService.setInChecks(res))
    );
  }

  getInCheckById(id: number): Observable<InventoryCheck> {
    return this.http.get<InventoryCheck>(`${this.apiUrl}/id/${id}`);
  }

  createInCheck(inCheck: InCheckPayload): Observable<InCheckResponse> {
    return this.http
      .post<InCheckResponse>(this.apiUrl, inCheck)
      .pipe(
        tap((res) =>
          this.inventoryCheckService.createInCheck(res.inventoryCheck)
        )
      );
  }
}
