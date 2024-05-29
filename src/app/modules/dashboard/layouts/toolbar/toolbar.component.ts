import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthApiService } from '../../../auth/services/auth-api.service';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  private profileService = inject(ProfileService);
  private authService = inject(AuthApiService);
  private themeService = inject(ThemeService);

  isDarkTheme: boolean;
  profile$: Observable<Profile>;
  title: string = '';

  ngOnInit(): void {
    this.profile$ = this.profileService.onListener();
    this.isDarkTheme = this.themeService.getTheme();
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }

  onSwitchTheme(event: MouseEvent): void {
    event.stopPropagation();
    this.themeService.setTheme(this.isDarkTheme);
  }
}
