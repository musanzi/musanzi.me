import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { PageTitleStrategy } from './page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
