import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable, Subscription, filter } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter();

  private document: Document = inject(DOCUMENT);
  private subscription = new Subscription();
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  private themeKey: string = 'dark-theme';
  isDarkTheme: boolean;
  user$: Observable<User>;
  title: string;

  ngOnInit(): void {
    this.setTheme();
    this.user$ = this.userService.onUserListener();
    this.title = this.setTitle(this.router.url);

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
    const classTheme = this.document.documentElement.classList;

    if (this.isDarkTheme) {
      classTheme.add(this.themeKey);
      localStorage.setItem(this.themeKey, this.isDarkTheme.toString());
    } else {
      classTheme.remove(this.themeKey);
      localStorage.setItem(this.themeKey, this.isDarkTheme.toString());
    }
  }

  private setTheme(): void {
    const classTheme = this.document.documentElement.classList;
    this.isDarkTheme =
      localStorage.getItem(this.themeKey) === 'true' ? true : false;

    if (this.isDarkTheme) classTheme.add(this.themeKey);
    else localStorage.setItem(this.themeKey, this.isDarkTheme.toString());
  }

  private setTitle(url: string): string {
    return url.split('/')[1];
  }
}
