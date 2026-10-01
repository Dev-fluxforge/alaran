import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationResult } from 'firebase/auth';
import { AuthService } from './auth.service';
import { MANAGE_PROJECTS_PATH } from './app-config';

type EmailMode = 'signin' | 'signup';
type PhoneStep = 'enter-phone' | 'enter-code';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isConfigured = this.authService.isConfigured;
  emailMode = signal<EmailMode>('signin');
  isSubmitting = signal(false);
  errorMessage = signal<string>('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  phoneStep = signal<PhoneStep>('enter-phone');
  phoneForm = this.fb.group({
    phoneNumber: ['', Validators.required],
  });
  codeForm = this.fb.group({
    code: ['', Validators.required],
  });
  private confirmationResult: ConfirmationResult | null = null;

  setEmailMode(mode: EmailMode): void {
    this.emailMode.set(mode);
    this.errorMessage.set('');
  }

  private goToManageProjects(): void {
    this.router.navigateByUrl('/' + MANAGE_PROJECTS_PATH);
  }

  async onEmailSubmit(): Promise<void> {
    this.errorMessage.set('');
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const { email, password } = this.emailForm.getRawValue();
    try {
      if (this.emailMode() === 'signup') {
        await this.authService.signUp(email!, password!);
      } else {
        await this.authService.login(email!, password!);
      }
      this.goToManageProjects();
    } catch (err: any) {
      this.errorMessage.set(this.friendlyError(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onGoogleClick(): Promise<void> {
    this.errorMessage.set('');
    this.isSubmitting.set(true);
    try {
      await this.authService.loginWithGoogle();
      this.goToManageProjects();
    } catch (err: any) {
      this.errorMessage.set(this.friendlyError(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onSendCode(): Promise<void> {
    this.errorMessage.set('');
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    try {
      const { phoneNumber } = this.phoneForm.getRawValue();
      this.confirmationResult = await this.authService.sendPhoneCode(
        phoneNumber!,
        'recaptcha-container'
      );
      this.phoneStep.set('enter-code');
    } catch (err: any) {
      this.errorMessage.set(this.friendlyError(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onVerifyCode(): Promise<void> {
    this.errorMessage.set('');
    if (this.codeForm.invalid || !this.confirmationResult) {
      this.codeForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    try {
      const { code } = this.codeForm.getRawValue();
      await this.confirmationResult.confirm(code!);
      this.goToManageProjects();
    } catch (err: any) {
      this.errorMessage.set(this.friendlyError(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  changePhoneNumber(): void {
    this.phoneStep.set('enter-phone');
    this.codeForm.reset();
    this.errorMessage.set('');
  }

  private friendlyError(err: any): string {
    const code: string = err?.code || '';
    if (
      code.includes('wrong-password') ||
      code.includes('user-not-found') ||
      code.includes('invalid-credential')
    ) {
      return 'Incorrect email or password.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with that email already exists — try signing in instead.';
    }
    if (code.includes('weak-password')) {
      return 'Password should be at least 6 characters.';
    }
    if (code.includes('invalid-phone-number')) {
      return 'Enter the phone number with its country code, e.g. +2348012345678.';
    }
    if (code.includes('invalid-verification-code')) {
      return "That code isn't right. Please try again.";
    }
    if (code.includes('popup-closed-by-user')) {
      return 'Google sign-in was closed before finishing.';
    }
    if (code.includes('too-many-requests')) {
      return 'Too many attempts. Please wait a bit and try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
