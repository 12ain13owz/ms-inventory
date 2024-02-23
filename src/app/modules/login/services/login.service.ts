import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoginModel } from '../models/login.model';
import { exhaustMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginModel) {
    return this.http.post(this.apiUrl + 'login', data);
  }
}
