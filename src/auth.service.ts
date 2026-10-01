import { Injectable, signal, computed } from '@angular/core';
import {
  getAuth,
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirebaseApp } from './firebase-app';
import { AUTHORIZED_EMAILS, AUTHORIZED_PHONE_NUMBERS } from './app-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  isConfigured = false;

  /** True once Firebase has reported whether someone is logged in or not. */
  authReady = signal(false);
  private currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  userEmail = computed(() => this.currentUser()?.email ?? null);
  userPhone = computed(() => this.currentUser()?.phoneNumber ?? null);

  /**
   * Anyone can sign up, but only identities listed in app-config.ts can
   * actually manage projects. Firestore rules enforce this for real; this
   * signal just drives a friendlier message in the UI.
   */
  isAuthorizedUser = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    const email = user.email?.toLowerCase() ?? null;
    const phone = user.phoneNumber ?? null;
    const emailMatch = !!email && AUTHORIZED_EMAILS.some((e) => e.toLowerCase() === email);
    const phoneMatch = !!phone && AUTHORIZED_PHONE_NUMBERS.includes(phone);
    return emailMatch || phoneMatch;
  });

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

  async signUp(email: string, password: string): Promise<void> {
    if (!this.auth) throw new Error('Login is not set up yet.');
    await createUserWithEmailAndPassword(this.auth, email.trim(), password);
  }

  async loginWithGoogle(): Promise<void> {
    if (!this.auth) throw new Error('Login is not set up yet.');
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  /**
   * Sends an SMS verification code to phoneNumber (must include country
   * code, e.g. +2348012345678). containerId must be an element already in
   * the DOM (an invisible reCAPTCHA is attached to it). Returns a
   * ConfirmationResult — call .confirm(code) on it with the code the user
   * receives.
   */
  async sendPhoneCode(phoneNumber: string, containerId: string): Promise<ConfirmationResult> {
    if (!this.auth) throw new Error('Login is not set up yet.');
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
      });
    }
    return signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
  }

  async logout(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
  }
}
