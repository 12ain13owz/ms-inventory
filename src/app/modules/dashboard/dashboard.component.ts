import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { UserApiService } from './services/user-api.service';
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) private sidenav: MatSidenav;

  private subscription = new Subscription();
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private userService = inject(UserService);
  private userApiService = inject(UserApiService);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(
          ([event, isHandset]) => isHandset && event instanceof NavigationEnd
        )
      )
      .subscribe(() => this.sidenav.close());

    console.log(0);

    const id = this.userService.getUser().id;
    this.userApiService
      .getUser(id)
      .subscribe((user) => this.userService.setUser(user));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
