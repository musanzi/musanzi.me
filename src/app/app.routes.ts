import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./landing/feature/home/home.component').then((c) => c.HomeComponent),
  },
];
