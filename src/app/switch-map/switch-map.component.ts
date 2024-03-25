import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Subject, Subscription, catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-switch-map',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './switch-map.component.html',
  styleUrl: './switch-map.component.scss',
})
export class SwitchMapComponent {
  url = 'http://localhost:3000/';
  urlError = this.url + 'error';
  http = inject(HttpClient);

  subject = new Subject<string>();
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscribeToSubject();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  Test() {
    if (this.subscription.closed) this.subscribeToSubject();
    this.subject.next(this.url);
  }

  TestError() {
    this.subject.next(this.urlError);
  }

  TestSubscription() {
    console.log(this.subscription.closed);
  }

  subscribeToSubject() {
    this.subscription = this.subject
      .pipe(
        switchMap((url) => this.http.get(url, { responseType: 'text' })),
        catchError((error) => throwError(() => error))
      )
      .subscribe({
        next: () => console.log('Test Subject'),
        error: () => console.log('Test Subject Error'),
      });
  }
}
