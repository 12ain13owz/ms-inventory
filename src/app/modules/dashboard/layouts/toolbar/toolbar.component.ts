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

  user: User;
  user$: Observable<User>;
  title: string;

  ngOnInit(): void {
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

  private setTitle(url: string): string {
    return url.split('/')[1];
  }
}
