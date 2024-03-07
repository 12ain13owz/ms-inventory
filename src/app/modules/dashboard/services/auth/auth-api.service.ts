import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { TokenService } from '../../../shared/services/token.service';
import { Router } from '@angular/router';
import { AccessToken } from '../../../shared/models/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUrl: string = environment.apiUrl + 'auth/';
  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  logout(): Observable<{ message: string }> {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);

    return this.http.delete<{ message: string }>(this.apiUrl + 'logout', {
      withCredentials: true,
    });
  }

  refreshToken(): Observable<AccessToken> {
    return this.http.post<AccessToken>(
      this.apiUrl + 'refresh',
      {},
      { withCredentials: true }
    );
  }
}
