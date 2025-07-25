import { Component } from '@angular/core';
import { SwitcherComponent } from '../../../shared/components/switcher/switcher.component';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  imports: [SwitcherComponent, LucideAngularModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  icons = {
    moveUpRight: MoveUpRight,
  };
}
