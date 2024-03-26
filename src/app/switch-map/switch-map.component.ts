import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  Subject,
  Subscription,
  catchError,
  filter,
  fromEvent,
  interval,
  of,
  switchMap,
  take,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';

@Component({
  selector: 'app-switch-map',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './switch-map.component.html',
  styleUrl: './switch-map.component.scss',
})
export class SwitchMapComponent {
  @ViewChild('btn') btn: ElementRef;

  url = 'http://localhost:3000/';
  urlError = this.url + 'error';
  http = inject(HttpClient);

  subject = new Subject<string>();
  subscription = new Subscription();

  testViewChild = false;

  ngOnInit(): void {
    this.subscribeToSubject();
  }

  ngAfterViewInit(): void {
    let counter = 0;

    interval(500)
      .pipe(
        takeWhile(() => {
          console.log(counter);
          counter++;
          return counter <= 10;
        }),
        filter(() => this.btn !== undefined),
        tap(() => console.log(this.btn)),
        take(1)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ButtonTestViewChild() {
    this.testViewChild = !this.testViewChild;
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
