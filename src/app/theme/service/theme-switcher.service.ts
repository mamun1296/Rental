import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

enum THEME_CLASS {
  DARK_THEME = 'themeDark',
  LIGHT_THEME = 'themeLight'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  private readonly THEME_STORAGE_KEY = 'user-theme';

  constructor(@Inject(DOCUMENT) private document: Document) { 
    this.loadTheme();
  }

  setTheme(isLightMode: boolean) {
    const theme = isLightMode ? THEME_CLASS.LIGHT_THEME : THEME_CLASS.DARK_THEME;
    const oppositeTheme = !isLightMode ? THEME_CLASS.LIGHT_THEME : THEME_CLASS.DARK_THEME;

    this.removeThemeClass(oppositeTheme);
    this.document.body.classList.add(theme);
    
    // Save the current theme in local storage
    this.saveThemeToLocalStorage(theme);
  }

  private removeThemeClass(theme: THEME_CLASS) {
    if (this.document.body.classList.contains(theme)) {
      this.document.body.classList.remove(theme);
    }
  }

  private loadTheme() {
    const savedTheme = this.getThemeFromLocalStorage();
    if (savedTheme) {
      // Apply the saved theme
      this.document.body.classList.add(savedTheme);
    } else {
      // Default to light theme if no theme is saved
      this.setTheme(true);
    }
  }

  private getThemeFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.THEME_STORAGE_KEY);
    }
    return null; // localStorage is not available
  }

  private saveThemeToLocalStorage(theme: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }
}
