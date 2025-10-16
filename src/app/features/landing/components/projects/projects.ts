import { Component } from '@angular/core';
import { LucideAngularModule, MoveUpRight } from 'lucide-angular';
import { PROJECTS } from '../../data/projects.data';

@Component({
  selector: 'app-projects',
  imports: [LucideAngularModule],
  templateUrl: './projects.html'
})
export class Projects {
  projects = PROJECTS;
  icons = {
    moveUpRight: MoveUpRight
  };
}
