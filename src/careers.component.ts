
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DataService } from './data.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './careers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersComponent {
  private dataService = inject(DataService);
  jobs = this.dataService.jobs;

  formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  applicationForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    resume: new FormControl<File | null>(null, { validators: [Validators.required] }),
    coverLetter: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.applicationForm.patchValue({ resume: fileList[0] });
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      this.formStatus.set('submitting');
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form Submitted:', this.applicationForm.value);
        this.formStatus.set('success');
        this.applicationForm.reset();
      }, 1500);
    } else {
      this.applicationForm.markAllAsTouched();
    }
  }
}
