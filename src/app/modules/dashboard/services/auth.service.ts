import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TokenService } from '../../shared/services/token.service';
import { Router } from '@angular/router';
import { AuthToken } from '../../shared/models/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  refreshToken(refreshToken: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(
      this.apiUrl + 'auth/refresh',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-refresh-token': refreshToken,
        },
      }
    );
  }
}
