import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./landing/landing-page/landing-page.component').then((c) => c.LandingPageComponent),
  },
];
