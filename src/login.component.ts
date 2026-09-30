import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MANAGE_PROJECTS_PATH } from './app-config';

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
  isSubmitting = signal(false);
  errorMessage = signal<string>('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { email, password } = this.loginForm.getRawValue();
    try {
      await this.authService.login(email!, password!);
      this.router.navigateByUrl('/' + MANAGE_PROJECTS_PATH);
    } catch (err) {
      // Deliberately generic — don't reveal whether the email exists.
      this.errorMessage.set('Incorrect email or password.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
