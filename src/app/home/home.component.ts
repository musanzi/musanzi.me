import { Component } from '@angular/core';
import { HeroComponent } from './feature/hero/hero.component';
import { ExperienceComponent } from './feature/experience/experience.component';
import { AchievementsComponent } from './feature/achievements/achievements.component';
import { ServicesComponent } from './feature/services/services.component';
import { FooterComponent } from './feature/footer/footer.component';
import { AboutComponent } from './feature/about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ExperienceComponent,
    AchievementsComponent,
    ServicesComponent,
    FooterComponent,
    AboutComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
