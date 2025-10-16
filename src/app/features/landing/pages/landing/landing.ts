import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Experience } from '../../components/experience/experience';
import { Footer } from '../../../../shared/components/footer/footer';
import { Projects } from '../../components/projects/projects';
import { Services } from '../../components/services/services';

@Component({
  selector: 'app-landing',
  imports: [Hero, Experience, Projects, Services, Footer, About],
  templateUrl: './landing.html'
})
export class Landing {}
