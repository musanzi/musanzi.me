import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, AsyncPipe, NgIf],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  currentSlide = signal(0);

  images: { imgPath: string }[] = [
    { imgPath: '/images/hero.jpeg' },
    { imgPath: '/images/meeting.jpeg' },
    { imgPath: '/images/hero.jpeg' }
  ];

  activities: { fade: string; title: string }[] = [
    { fade: 'fade-in-4', title: 'Utajiri' },
    { fade: 'fade-in-5', title: 'Élevage' },
    { fade: 'fade-in-6', title: 'Agriculture' },
    { fade: 'fade-in-7', title: 'Énergie' }
  ];
}
