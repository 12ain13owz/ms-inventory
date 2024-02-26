import { Component, inject } from '@angular/core';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent {
  private userApiService = inject(UserApiService);
  users: any;

  onClick() {
    this.userApiService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
