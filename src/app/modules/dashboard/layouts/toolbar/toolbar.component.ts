import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter();

  private subscription = new Subscription();
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  isDarkTheme: boolean;
  user$: Observable<User>;
  title: string;

  ngOnInit(): void {
    this.user$ = this.userService.onUserListener();
    this.title = this.setTitle(this.router.url);
    this.isDarkTheme = this.themeService.getTheme();

    this.subscription = this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(
        (event: NavigationEnd) =>
          (this.title = this.setTitle(event.urlAfterRedirects))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }

  onSwitchTheme(event: MouseEvent) {
    event.stopPropagation();
    this.themeService.setTheme(this.isDarkTheme);
  }

  private setTitle(url: string): string {
    return url.split('/').pop();
  }
}
