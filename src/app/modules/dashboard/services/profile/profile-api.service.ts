import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Password, Profile } from '../../models/profile.model';
import { ProfileService } from './profile.service';

import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { Message } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private apiUrl: string = environment.apiUrl + 'profile';

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private toastService: ToastNotificationService
  ) {}

  getProfile(): Observable<Profile> {
    return this.http
      .get<Profile>(this.apiUrl)
      .pipe(tap((profile) => this.profileService.setProfile(profile)));
  }

  updateProfile(payload: Partial<Profile>): Observable<Message> {
    return this.http.patch<Message>(this.apiUrl, payload).pipe(
      tap((res) => {
        this.profileService.updateProfile(payload);
        this.toastService.success('', res.message);
      })
    );
  }

  changePassword(payload: Password): Observable<Message> {
    return this.http
      .post<Message>(`${this.apiUrl}/password`, payload)
      .pipe(tap((res) => this.toastService.success('', res.message)));
  }
}
