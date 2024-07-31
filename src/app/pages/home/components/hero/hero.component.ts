import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, Inject, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  storedTheme = window.localStorage.getItem('isDark');
  isDark: WritableSignal<boolean> = this.storedTheme
    ? signal(this.storedTheme === 'true')
    : signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

  constructor(
    @Inject(DOCUMENT)
    private document: Document
  ) {
    this.updateTheme();
  }

  switchTheme(): void {
    this.isDark.update((isDark) => !isDark);
    window.localStorage.setItem('isDark', this.isDark().toString());
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.isDark()) this.document.body.classList.add('dark');
    else this.document.body.classList.remove('dark');
  }
}
