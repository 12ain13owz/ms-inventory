import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import { LogService } from '../log/log.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { Inventory, InventoryResponse } from '../../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryApiService {
  private apiUrl: string = environment.apiUrl + 'inventory';

  constructor(
    private http: HttpClient,
    private inventoryService: InventoryService,
    // private socketParcelService: SocketParcelService,
    private logService: LogService // private socketLogService: SocketLogService
  ) {}

  getAllInventorys(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.setInventories(res))
    );
  }

  getInitialInventorys(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/init`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.setInventories(res))
    );
  }

  getInventorysByDate(
    startDate: string,
    endDate: string
  ): Observable<Inventory[]> {
    return this.http
      .get<Inventory[]>(`${this.apiUrl}/date/${startDate}/${endDate}`)
      .pipe(
        switchMap((res) => timer(200).pipe(map(() => res))),
        tap((res) => this.inventoryService.setInventories(res))
      );
  }

  getInventoryById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/id/${id}`);
  }

  getInventoryByCode(code: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/code/${code}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.inventoryService.setInventory(res))
    );
  }

  createInventory(payload: FormData): Observable<InventoryResponse> {
    return this.http.post<InventoryResponse>(this.apiUrl, payload).pipe(
      tap((res) => this.inventoryService.createInventory(res.inventory)),
      // tap((res) => this.socketParcelService.createParcel(res.parcel)),
      tap((res) => this.logService.createLog(res.log))
      // tap((res) => this.socketLogService.createLog(res.log))
    );
  }

  updateInventory(
    id: number,
    payload: FormData
  ): Observable<InventoryResponse> {
    return this.http
      .put<InventoryResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((res) => this.inventoryService.updateInventory(id, res.inventory)),
        // tap((res) => this.socketParcelService.updateParcel(id, res.parcel)),
        tap((res) => this.logService.createLog(res.log))
        // tap((res) => this.socketLogService.createLog(res.log))
      );
  }

  downloadImage(url: string): Observable<Blob> {
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }
}
