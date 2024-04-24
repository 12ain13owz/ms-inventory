import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { TokenService } from '../../../shared/services/token.service';
import { Router } from '@angular/router';
import { AccessToken } from '../../../shared/models/token.model';
import { Observable, finalize, tap } from 'rxjs';
import { LoadingScreenService } from '../../../../core/services/loading-screen.service';
import { ProfileService } from '../profile/profile.service';
import { Message } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUrl: string = environment.apiUrl + 'auth/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService,
    private loadingScreenSerivce: LoadingScreenService,
    private profileService: ProfileService
  ) {}

  logout(): Observable<Message> {
    return this.http
      .delete<Message>(`${this.apiUrl}logout`, {
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          this.loadingScreenSerivce.setIsLoading(false);
          this.profileService.setProfile(null);
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
    return this.http.post<AccessToken>(
      `${this.apiUrl}refresh`,
      {},
      { headers, withCredentials: true }
    );
  }
}
