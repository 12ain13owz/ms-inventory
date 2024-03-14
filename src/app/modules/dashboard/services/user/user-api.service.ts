import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, tap } from 'rxjs';
import { User, UserPassword, UserResponse } from '../../models/user.model';
import { Message } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiUrl: string = environment.apiUrl + 'user';

  constructor(private http: HttpClient, private userService: UserService) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(tap((res) => this.userService.setUsers(res)));
  }

  createUser(payload: User): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.userService.createUser(res.user)));
  }

  updateUser(id: number, payload: User): Observable<UserResponse> {
    return this.http
      .patch<UserResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.userService.updateUser(res.user)));
  }

  changeUserPassword(id: number, payload: UserPassword): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/password/${id}`, payload);
  }
}
