import { Component, OnInit, inject } from '@angular/core';
import { LoadingScreenService } from '../../services/loading-screen.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { catchError, delay, finalize, retry, throwError } from 'rxjs';
import { ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private loadingScresnSergvice = inject(LoadingScreenService);
  private toastr = inject(ToastNotificationService);
  private apiUrl = environment.localhost + 'health';

  ngOnInit(): void {
    const redirected = this.route.snapshot.queryParamMap.get('redirected');
    if (redirected) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
      });
    } else this.checkhealth(redirected);

    const delayConnect = 3000;
    const maxRetry = 10;
    this.http
      .get(this.apiUrl, { responseType: 'text' })
      .pipe(
        delay(delayConnect),
        retry({ count: maxRetry, delay: delayConnect })
      )
      .subscribe(() => this.router.navigate(['/']));
  }

  checkhealth(redirected: string) {
    this.loadingScresnSergvice.setIsLoading(true);
    this.http
      .get(this.apiUrl, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          if (!redirected) this.toastr.error('500', 'Internal Server Error!');
          return throwError(() => error);
        }),
        finalize(() => this.loadingScresnSergvice.setIsLoading(false))
      )
      .subscribe(() => this.router.navigate(['/']));
  }
}
