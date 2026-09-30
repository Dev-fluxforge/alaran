import { Injectable, signal, computed } from '@angular/core';
import {
  getAuth,
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirebaseApp } from './firebase-app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth | null = null;
  isConfigured = false;

  /** True once Firebase has reported whether someone is logged in or not. */
  authReady = signal(false);
  private currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  userEmail = computed(() => this.currentUser()?.email ?? null);

  constructor() {
    const app = getFirebaseApp();
    if (!app) {
      // Nothing to wait for — mark ready immediately so the login page
      // doesn't spin forever, but isConfigured stays false.
      this.authReady.set(true);
      return;
    }
    this.auth = getAuth(app);
    this.isConfigured = true;
    setPersistence(this.auth, browserLocalPersistence).catch((err) =>
      console.error('[Alaran] Could not set auth persistence:', err)
    );
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.authReady.set(true);
    });
  }

  async login(email: string, password: string): Promise<void> {
    if (!this.auth) throw new Error('Login is not set up yet.');
    await signInWithEmailAndPassword(this.auth, email.trim(), password);
  }

  async logout(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
  }
}
