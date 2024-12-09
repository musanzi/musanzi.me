import { Component } from '@angular/core';
import { experiences } from './utils/data/experiences.data';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  experiences = experiences;
}
