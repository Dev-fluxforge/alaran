
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
      
      const formValue = this.contactForm.value;
      const recipient = 'alarangeoserviceslimited@gmail.com';
      const subject = encodeURIComponent(formValue.subject || 'Contact from Website');
      const body = encodeURIComponent(
        `Full Name: ${formValue.fullName}\n` +
        `Email: ${formValue.email}\n\n` +
        `Message:\n${formValue.message}`
      );
      
      // Construct the mailto link
      const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
      
      // Open the user's default email client
      window.location.href = mailtoLink;
      
      // Set status to success and reset form
      setTimeout(() => {
        this.formStatus.set('success');
        this.contactForm.reset();
      }, 500);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
