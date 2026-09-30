import { initializeApp, FirebaseApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './app-config';

let app: FirebaseApp | null = null;
let attempted = false;

/**
 * Returns the shared Firebase app instance, creating it on first call.
 * Returns null if app-config.ts still has placeholder values.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (attempted) return app;
  attempted = true;

  const looksConfigured = !FIREBASE_CONFIG.apiKey.startsWith('YOUR_');
  if (!looksConfigured) return null;

  try {
    app = initializeApp(FIREBASE_CONFIG);
  } catch (err) {
    console.error('[Alaran] Firebase failed to initialize:', err);
    app = null;
  }
  return app;
}
