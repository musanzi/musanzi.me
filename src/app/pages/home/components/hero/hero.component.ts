import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { SwitcherComponent } from '../../../../shared/components/switcher/switcher.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, SwitcherComponent],
  templateUrl: './hero.component.html'
})
export class HeroComponent {}
