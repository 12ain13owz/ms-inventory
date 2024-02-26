import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LoginRequest } from '../models/login.model';
import { AccessToken } from '../../shared/models/token.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AccessToken> {
    return this.http.post<AccessToken>(this.apiUrl + 'auth/login', data, {
      withCredentials: true,
    });
  }
}
