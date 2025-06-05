import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ServicesComponent } from '../services/services.component';
import { FooterComponent } from '../footer/footer.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ExperienceComponent, ProjectsComponent, ServicesComponent, FooterComponent, AboutComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
