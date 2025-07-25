import { Component } from '@angular/core';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';
import { PROJECTS } from '../../data/projects.data';

@Component({
  selector: 'app-projects',
  imports: [LucideAngularModule],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  projects = PROJECTS;
  icons = {
    moveUpRight: MoveUpRight,
  };
}
