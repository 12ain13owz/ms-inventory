import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Profile } from '../models/profile.model';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private apiUrl: string = environment.apiUrl + 'user/';
  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {}

  getProfile(id: number): Observable<Profile> {
    return this.http
      .get<Profile>(this.apiUrl + id)
      .pipe(tap((profile) => this.profileService.setProfile(profile)));
  }
}
