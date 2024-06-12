import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LoadingScreenService } from '../../services/loading-screen.service';
import { Subscription } from 'rxjs';
import { FadeInOut } from '../../animations/animation';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss',
  animations: [FadeInOut(200, 200, true)],
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private loadingScreenService = inject(LoadingScreenService);
  isLoading: boolean = false;

  ngOnInit(): void {
    this.subscription = this.loadingScreenService
      .onIsLoadingListener()
      .subscribe((isLoading) => (this.isLoading = isLoading));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
