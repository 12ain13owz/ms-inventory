import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-data',
  templateUrl: './loading-data.component.html',
  styleUrl: './loading-data.component.scss',
})
export class LoadingDataComponent implements OnInit, OnDestroy {
  @Input() heigh: string = '50px';
  @Input() form: 'card' | 'list' = 'card';

  private subscription = new Subscription();
  private themeService = inject(ThemeService);
  backgroundColor: string = '#EFF1F5';

  ngOnInit(): void {
    this.subscription = this.themeService
      .onThemeListener()
      .subscribe((theme) => {
        if (theme) this.backgroundColor = '#323232';
        else this.backgroundColor = '#EFF1F5';
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
