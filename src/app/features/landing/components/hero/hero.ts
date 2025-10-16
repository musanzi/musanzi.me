import { Component } from '@angular/core';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';
import { Switcher } from '../../../../shared/components/switcher/switcher';

@Component({
  selector: 'app-hero',
  imports: [Switcher, LucideAngularModule],
  templateUrl: './hero.html'
})
export class Hero {
  icons = {
    moveUpRight: MoveUpRight
  };
}
