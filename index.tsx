

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './src/app.component';
import { APP_ROUTES } from './src/app.routes';

// The site used to use hash URLs (https://a-gsl.com/#/projects). Rewrite any such
// old link (bookmarks, shared posts) to the clean path before the router starts.
if (location.hash.startsWith('#/')) {
  history.replaceState(null, '', location.hash.slice(1));
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    )
  ],
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
