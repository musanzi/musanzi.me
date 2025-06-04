import { Component } from '@angular/core';
import { HeroComponent } from './feature/hero/hero.component';
import { ExperienceComponent } from './feature/experience/experience.component';
import { ProjectsComponent } from './feature/projects/projects.component';
import { ServicesComponent } from './feature/services/services.component';
import { FooterComponent } from './feature/footer/footer.component';
import { AboutComponent } from './feature/about/about.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ExperienceComponent, ProjectsComponent, ServicesComponent, FooterComponent, AboutComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
