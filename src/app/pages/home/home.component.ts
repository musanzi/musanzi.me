import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { ServicesComponent } from './components/services/services.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ExperienceComponent, AchievementsComponent, ServicesComponent, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
