import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { AboutComponent } from '../components/about/about.component';
import { ExperienceComponent } from '../components/experience/experience.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ServicesComponent } from '../components/services/services.component';

@Component({
  selector: 'app-landing-page',
  imports: [HeroComponent, ExperienceComponent, ProjectsComponent, ServicesComponent, FooterComponent, AboutComponent],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {}
