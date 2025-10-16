import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Accueil',
    loadComponent: () => import('./features/landing/pages/landing/landing').then((m) => m.Landing)
  }
];
