import { Component } from '@angular/core';
import { IExperience } from './types/experience.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  experiences: IExperience[] = [
    {
      position: 'Frontend Developer',
      company: 'ZX Connect',
      location: 'Lubumbashi, DR Congo',
      description: 'Description 1',
      duration: {
        from: 'November 2020',
        to: 'September 2020'
      },
      tools: ['typescript', 'react', 'nextjs', 'firebase', 'tailwindcss', 'git', 'github']
    },
    {
      position: 'Fullstack Developer',
      company: "Centre d'innovation de Lubumbashi",
      location: 'Lubumbashi, DR Congo',
      description: 'Description 1',
      duration: {
        from: 'November 2023',
        to: 'Present'
      },
      tools: ['typescript', 'angular', 'nestjs', 'mariadb', 'tailwindcss', 'git', 'github', 'vps']
    }
  ];
}
