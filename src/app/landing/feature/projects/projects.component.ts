import { Component } from '@angular/core';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';
import { projects } from '../../utils/data/projects';

@Component({
  selector: 'app-projects',
  imports: [LucideAngularModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  projects = projects;
  icons = {
    moveUpRight: MoveUpRight
  };
}
