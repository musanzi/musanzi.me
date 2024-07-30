import { AsyncPipe, DOCUMENT, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Inject, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, AsyncPipe, NgIf],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  isDark: WritableSignal<boolean> = signal(window.localStorage.getItem('isDark') === 'true');

  constructor(
    @Inject(DOCUMENT)
    private document: Document
  ) {
    if (this.isDark()) {
      this.document.body.classList.add('dark');
    }
  }

  switchTheme(): void {
    this.isDark.update((isDark) => !isDark);
    if (this.isDark()) {
      this.document.body.classList.add('dark');
      window.localStorage.setItem('isDark', this.isDark().toString());
    } else {
      this.document.body.classList.remove('dark');
      window.localStorage.setItem('isDark', this.isDark().toString());
    }
  }
}
