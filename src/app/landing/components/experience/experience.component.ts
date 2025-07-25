import { Component } from '@angular/core';
import { EXPERIENCES } from '../../data/experiences.data';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';

@Component({
  selector: 'app-experience',
  imports: [LucideAngularModule],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  experiences = EXPERIENCES;
  icons = {
    moveUpRight: MoveUpRight,
  };
}
