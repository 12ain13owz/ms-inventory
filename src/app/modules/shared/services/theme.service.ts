import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document: Document = inject(DOCUMENT);
  private themeKey: string = 'dark-theme';
  private isDarkTheme: boolean =
    localStorage.getItem(this.themeKey) === 'true' ? true : false;
  private isDarkTheme$ = new BehaviorSubject<boolean>(this.isDarkTheme);
  private docTheme = this.document.documentElement.classList;

  constructor() {
    this.onThemeListener().subscribe((theme) => {
      if (theme) {
        this.docTheme.add(this.themeKey);
        localStorage.setItem(this.themeKey, theme.toString());
      } else {
        this.docTheme.remove(this.themeKey);
        localStorage.setItem(this.themeKey, theme.toString());
      }
    });
  }

  onThemeListener(): Observable<boolean> {
    return this.isDarkTheme$.asObservable();
  }

  getTheme(): boolean {
    return this.isDarkTheme;
  }

  setTheme(theme: boolean) {
    this.isDarkTheme = theme;
    this.isDarkTheme$.next(theme);
  }
}
