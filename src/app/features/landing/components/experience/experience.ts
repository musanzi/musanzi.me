import { Component } from '@angular/core';
import { EXPERIENCES } from '../../data/experiences.data';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';

@Component({
  selector: 'app-experience',
  imports: [LucideAngularModule],
  templateUrl: './experience.html'
})
export class Experience {
  experiences = EXPERIENCES;
  icons = {
    moveUpRight: MoveUpRight
  };
}
