import { Component, inject } from '@angular/core';
import { AuthApiService } from '../../../auth/services/auth-api.service';

@Component({
  selector: 'app-refresh-token',
  templateUrl: './refresh-token.component.html',
  styleUrl: './refresh-token.component.scss',
})
export class RefreshTokenComponent {
  private auth = inject(AuthApiService);

  onRefresh() {
    this.auth.refreshToken().subscribe((res) => {
      console.log(res);
    });
  }
}
