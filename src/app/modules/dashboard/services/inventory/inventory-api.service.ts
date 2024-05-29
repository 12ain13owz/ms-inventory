import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import { LogService } from '../log/log.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { Inventory, InventoryWithLog } from '../../models/inventory.model';
import { SocketLogService } from '../../socket-io/socket-log.service';
import { SocketInventoryService } from '../../socket-io/socket-inventory.service';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryApiService {
  private apiUrl: string = environment.apiUrl + 'inventory';

  constructor(
    private http: HttpClient,
    private inventoryService: InventoryService,
    private socketInventoryService: SocketInventoryService,
    private logService: LogService,
    private socketLogService: SocketLogService
  ) {}

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.assign(res))
    );
  }

  getInit(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/init`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.assign(res))
    );
  }

  getByDate(startDate: string, endDate: string): Observable<Inventory[]> {
    return this.http
      .get<Inventory[]>(`${this.apiUrl}/date/${startDate}/${endDate}`)
      .pipe(
        switchMap((res) => timer(200).pipe(map(() => res))),
        tap((res) => this.inventoryService.assign(res))
      );
  }

  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/id/${id}`);
  }

  getByCode(code: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/code/${code}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.assign([res]))
    );
  }

  create(payload: FormData): Observable<ApiResponse<InventoryWithLog>> {
    return this.http
      .post<ApiResponse<InventoryWithLog>>(this.apiUrl, payload)
      .pipe(
        tap((res) => {
          this.inventoryService.create(res.item.inventory);
          this.socketInventoryService.create(res.item.inventory);
          this.logService.create(res.item.log);
          this.socketLogService.create(res.item.log);
        })
      );
  }

  update(
    id: number,
    payload: FormData
  ): Observable<ApiResponse<InventoryWithLog>> {
    return this.http
      .put<ApiResponse<InventoryWithLog>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((res) => {
          this.inventoryService.update(id, res.item.inventory);
          this.socketInventoryService.update(id, res.item.inventory);
          this.logService.create(res.item.log);
          this.socketLogService.create(res.item.log);
        })
      );
  }

  downloadImage(url: string): Observable<Blob> {
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }
}
