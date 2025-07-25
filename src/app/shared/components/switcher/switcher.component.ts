import { CommonModule, DOCUMENT } from '@angular/common';
import { afterRender, Component, Inject, signal } from '@angular/core';
import { LucideAngularModule, MoonStar, Sun } from 'lucide-angular';

@Component({
  selector: 'app-switcher',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './switcher.component.html',
})
export class SwitcherComponent {
  isDark = signal<boolean>(false);
  icons = {
    light: MoonStar,
    dark: Sun,
  };

  constructor(@Inject(DOCUMENT) private document: Document) {
    afterRender(() => {
      const storedTheme = window.localStorage.getItem('isDark');
      this.isDark = storedTheme
        ? signal(storedTheme === 'true')
        : signal(window.matchMedia('(prefers-color-scheme: dark)').matches);
      this.updateTheme();
    });
  }

  switchTheme(): void {
    this.isDark.update((isDark) => !isDark);
    window.localStorage.setItem('isDark', `${this.isDark()}`);
    this.updateTheme();
  }

  updateTheme(): void {
    if (this.isDark()) this.document.body.classList.add('dark');
    else this.document.body.classList.remove('dark');
  }
}
