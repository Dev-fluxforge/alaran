
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  
  contactForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.formStatus.set('submitting');
      console.log(this.contactForm.value);
      // Simulate API call
      setTimeout(() => {
        this.formStatus.set('success');
        // this.contactForm.reset();
      }, 1500);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
