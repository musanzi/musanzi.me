import { Component } from '@angular/core';
import { experiences } from '../../utils/data/experiences';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';

@Component({
  selector: 'app-experience',
  imports: [LucideAngularModule],
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  experiences = experiences;
  icons = {
    moveUpRight: MoveUpRight
  };
}
