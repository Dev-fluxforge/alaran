
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  
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
      
      this.http.post('/api/contact', this.contactForm.value).subscribe({
        next: (response: any) => {
          this.formStatus.set('success');
          this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.formStatus.set('error');
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
