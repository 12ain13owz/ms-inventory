import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryCheckService } from './inventory-check.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import {
  InventoryCheck,
  InventoryCheckPayload,
} from '../../models/inventory-check';
import { ApiResponse } from '../../../shared/models/response.model';
import { SocketLogService } from '../../socket-io/socket-log.service';
import { LogService } from '../log/log.service';
import { SocketInventoryService } from '../../socket-io/socket-inventory.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryCheckApiService {
  private apiUrl: string = environment.apiUrl + 'inventory-check';

  constructor(
    private http: HttpClient,
    private inventoryCheckService: InventoryCheckService,
    private inventoryService: InventoryService,
    private socketInventoryService: SocketInventoryService,
    private logService: LogService,
    private socketLogService: SocketLogService
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

  create(
    payload: InventoryCheckPayload
  ): Observable<ApiResponse<InventoryCheck>> {
    return this.http
      .post<ApiResponse<InventoryCheck>>(this.apiUrl, payload)
      .pipe(
        tap((res) => {
          const inventoryCheck = this.inventoryCheckService.getByInventoryId(
            res.item.Inventory.id
          );
          if (!inventoryCheck) this.inventoryCheckService.create(res.item);

          this.inventoryService.update(payload.inventoryId, {
            Status: {
              id: payload.inventoryStatusId,
              name: payload.inventoryStatusName,
            },
          });
          this.socketInventoryService.update(payload.inventoryId, {
            Status: {
              id: payload.inventoryStatusId,
              name: payload.inventoryStatusName,
            },
          });
        })
      );
  }
}
