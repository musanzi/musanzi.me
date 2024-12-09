import { Component } from '@angular/core';
import { SwitcherComponent } from '../../../shared/ui/switcher/switcher.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SwitcherComponent],
  templateUrl: './hero.component.html'
})
export class HeroComponent {}
