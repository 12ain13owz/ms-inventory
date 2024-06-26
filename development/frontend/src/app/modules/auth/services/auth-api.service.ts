import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../shared/services/token.service';
import { Router } from '@angular/router';
import { AccessToken } from '../models/token.model';
import { Observable, finalize, tap } from 'rxjs';
import { LoadingScreenService } from '../../../core/services/loading-screen.service';
import { ProfileService } from '../../dashboard/services/profile/profile.service';
import { Message } from '../../shared/models/response.model';
import { LoginRequest, LoginResponse } from '../models/login.model';
import {
  ForgetPasswordResult,
  ResetPasswordPayload,
} from '../models/forgot-password';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUrlAuth: string = environment.apiUrl + 'auth/';
  private apiUrlUser: string = environment.apiUrl + 'user/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService,
    private loadingScreenSerivce: LoadingScreenService,
    private profileService: ProfileService
  ) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrlAuth}login`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.tokenService.setAccessToken(res.accessToken);
          this.profileService.assign(res.payload);
        })
      );
  }

  logout(): Observable<Message> {
    return this.http
      .delete<Message>(`${this.apiUrlAuth}logout`, {
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          this.loadingScreenSerivce.setIsLoading(false);
          this.profileService.assign(null);
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        })
      );
  }

  refreshToken(): Observable<AccessToken> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.tokenService.getAccessToken()
    );
    return this.http.get<AccessToken>(`${this.apiUrlAuth}refresh`, {
      headers,
      withCredentials: true,
    });
  }

  forgetPassword(email: string): Observable<ForgetPasswordResult> {
    return this.http.post<ForgetPasswordResult>(
      `${this.apiUrlUser}forgot-password`,
      { email }
    );
  }

  resetPassword(
    id: number,
    payload: ResetPasswordPayload
  ): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrlUser}reset-password/${id}`,
      payload
    );
  }
}
