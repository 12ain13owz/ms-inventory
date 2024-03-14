import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  private router = inject(Router);
  private profileService = inject(ProfileService);

  isExpanded: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.isExpanded = this.router.url.includes('setting');
    this.isAdmin = this.profileService.getProfile().role === 'admin';
  }
}
