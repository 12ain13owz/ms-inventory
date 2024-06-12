import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { PrintService } from '../../services/print/print.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private printService = inject(PrintService);

  isExpanded: boolean = false;
  isAdmin: boolean = false;
  isBadge: boolean = false;
  badge: number;

  ngOnInit(): void {
    this.isExpanded = this.router.url.includes('setting');
    this.isAdmin = this.profileService.isAdmin();

    this.subscription = this.printService.onListener().subscribe((parcel) => {
      this.badge = parcel.length;

      if (this.badge > 0) this.isBadge = true;
      else this.isBadge = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
