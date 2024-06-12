import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  constructor() {}
  private isLoading$ = new BehaviorSubject(false);

  onIsLoadingListener() {
    return this.isLoading$.asObservable();
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }
}
