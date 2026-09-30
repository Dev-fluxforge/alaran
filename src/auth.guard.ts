import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LOGIN_PATH } from './app-config';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Firebase reports auth state asynchronously on page load — wait for the
  // first result so a logged-in client isn't briefly bounced to /login.
  if (!authService.authReady()) {
    await firstValueFrom(toObservable(authService.authReady).pipe(filter((ready) => ready)));
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/' + LOGIN_PATH);
};
