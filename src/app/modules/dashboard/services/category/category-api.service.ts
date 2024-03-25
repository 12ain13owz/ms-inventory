import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Message } from './../../../shared/models/response.model';
import { Category, CategoryResponse } from '../../models/category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private apiUrl: string = environment.apiUrl + 'category';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl)
      .pipe(tap((res) => this.categoryService.setCategorise(res)));
  }

  createCategory(payload: Category): Observable<CategoryResponse> {
    return this.http
      .post<CategoryResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.categoryService.createCategory(res.category)));
  }

  updateCategory(id: number, payload: Category): Observable<CategoryResponse> {
    return this.http
      .put<CategoryResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((res) => this.categoryService.updateCategory(id, res.category))
      );
  }

  deleteCategory(id: number): Observable<Message> {
    return this.http
      .delete<Message>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.categoryService.deleteCategory(id)));
  }
}
