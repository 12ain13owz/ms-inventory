import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from './../../../shared/models/response.model';
import { Category } from '../../models/category.model';
import { CategoryService } from './category.service';
import { SocketCategoryService } from '../../socket-io/socket-category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private apiUrl: string = environment.apiUrl + 'category';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
    private socketCategoryService: SocketCategoryService
  ) {}

  getAll(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl)
      .pipe(tap((res) => this.categoryService.assign(res)));
  }

  create(payload: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, payload).pipe(
      tap((res) => {
        this.categoryService.create(res.item);
        this.socketCategoryService.create(res.item);
      })
    );
  }

  update(id: number, payload: Category): Observable<ApiResponse<Category>> {
    return this.http
      .put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((res) => {
          this.categoryService.update(id, res.item);
          this.socketCategoryService.update(id, res.item);
        })
      );
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        this.categoryService.delete(id);
        this.socketCategoryService.delete(id);
      })
    );
  }
}
