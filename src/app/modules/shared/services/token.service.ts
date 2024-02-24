import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  private accessToken = 'accessToken';
  private refreshToken = 'refreshToken';

  removeToken(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  setAccessToken(token: string): void {
    localStorage.removeItem(this.accessToken);
    localStorage.setItem(this.accessToken, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshToken);
  }

  setRefreshToken(token: string): void {
    localStorage.removeItem(this.refreshToken);
    localStorage.setItem(this.refreshToken, token);
  }
}
