import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { PageTitleStrategy } from './page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideRouter(routes),
    provideClientHydration(),
  ],
};
