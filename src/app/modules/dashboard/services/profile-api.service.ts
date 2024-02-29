import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Password, Profile } from '../models/profile.model';
import { ProfileService } from './profile.service';
import { MessageRespones } from '../../login/models/response.model';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private apiUrl: string = environment.apiUrl + 'user';
  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private toastService: ToastNotificationService
  ) {}

  getProfile(id: number): Observable<Profile> {
    return this.http
      .get<Profile>(this.apiUrl + '/' + id)
      .pipe(tap((profile) => this.profileService.setProfile(profile)));
  }

  updateProfile(payload: Partial<Profile>): Observable<MessageRespones> {
    return this.http.put<MessageRespones>(this.apiUrl, payload).pipe(
      tap((res) => {
        this.profileService.updateProfile(payload);
        this.toastService.success('', res.message);
      })
    );
  }

  changePassword(payload: Password): Observable<MessageRespones> {
    return this.http
      .post<MessageRespones>(this.apiUrl + '/password', payload)
      .pipe(tap((res) => this.toastService.success('', res.message)));
  }
}
