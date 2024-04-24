import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { ProfileService } from '../../dashboard/services/profile/profile.service';
import { TokenService } from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private tokenService: TokenService
  ) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiUrl + 'auth/login', data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.tokenService.setAccessToken(res.accessToken);
          this.profileService.setProfile(res.payload);
        })
      );
  }
}
