import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  private accessToken = 'accessToken';

  removeToken(): void {
    localStorage.removeItem(this.accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  setAccessToken(token: string): void {
    localStorage.removeItem(this.accessToken);
    localStorage.setItem(this.accessToken, token);
  }
}
