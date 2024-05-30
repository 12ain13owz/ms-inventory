import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryCheckService } from './inventory-check.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import {
  InventoryCheck,
  InventoryCheckPayload,
  InventoryCheckWithLog,
} from '../../models/inventory-check';
import { ApiResponse } from '../../../shared/models/response.model';
import { SocketInventoryService } from '../../socket-io/socket-inventory.service';
import { InventoryService } from '../inventory/inventory.service';
import { LogService } from '../log/log.service';
import { SocketLogService } from '../../socket-io/socket-log.service';

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
  ): Observable<ApiResponse<InventoryCheckWithLog>> {
    return this.http
      .post<ApiResponse<InventoryCheckWithLog>>(this.apiUrl, payload)
      .pipe(
        tap((res) => {
          const inventoryCheck = this.inventoryCheckService.getByInventoryId(
            res.item.inventoryCheck.Inventory.id
          );

          if (!inventoryCheck)
            this.inventoryCheckService.create(res.item.inventoryCheck);

          this.inventoryService.update(payload.inventoryId, {
            Status: {
              id: payload.statusId,
              name: payload.statusName,
            },
          });
          this.socketInventoryService.update(payload.inventoryId, {
            Status: {
              id: payload.statusId,
              name: payload.statusName,
            },
          });

          if (!res.item.log) return;
          this.logService.create(res.item.log);
          this.socketLogService.create(res.item.log);
        })
      );
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(tap((res) => this.inventoryCheckService.delete(id)));
  }
}
