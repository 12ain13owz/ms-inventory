import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) private sidenav: MatSidenav;
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private subscription = new Subscription();

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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
