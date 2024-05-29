import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { ApiResponse, Message } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiUrl: string = environment.apiUrl + 'user';

  constructor(private http: HttpClient, private userService: UserService) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(tap((res) => this.userService.assign(res)));
  }

  create(payload: User): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<User>>(this.apiUrl, payload)
      .pipe(tap((res) => this.userService.create(res.item)));
  }

  update(id: number, payload: User): Observable<ApiResponse<User>> {
    return this.http
      .patch<ApiResponse<User>>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.userService.update(id, res.item)));
  }
}
