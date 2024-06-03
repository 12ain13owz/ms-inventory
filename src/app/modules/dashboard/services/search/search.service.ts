import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SearchApiService } from './search-api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private cache: string[] = [];
  search$ = new BehaviorSubject<string>('');

  constructor(private searchApiService: SearchApiService) {
    this.searchApiService.search('').subscribe((res) => (this.cache = res));
  }

  onListener(): Observable<string[]> {
    return this.search$.asObservable().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.onSearch(query))
    );
  }

  onSearch(query: string): Observable<string[]> {
    const items = this.cache.filter((item) => item.includes(query));
    if (items.length > 0) return of(items);

    return this.searchApiService.search(query).pipe(
      tap((res) => {
        const combine = new Set([...this.cache, ...res]);
        this.cache = Array.from(combine);
      })
    );
  }

  getCache(): string[] {
    return this.cache;
  }
}
