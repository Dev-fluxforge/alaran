import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, Project } from './data.service';
import { FirebaseService, StoredProject } from './firebase.service';
import { AuthService } from './auth.service';
import { LOGIN_PATH } from './app-config';

interface PendingFile {
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  uploadedUrl?: string;
  error?: string;
}

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageProjectsComponent {
  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isConfigured = this.firebaseService.isConfigured;
  serviceCategories = this.dataService.services;
  userEmail = this.authService.userEmail;
  userPhone = this.authService.userPhone;
  isAuthorizedUser = this.authService.isAuthorizedUser;

  clientProjects = signal<StoredProject[]>([]);
  editingId = signal<string | null>(null);
  existingImageUrls = signal<string[]>([]);

  pendingFiles = signal<PendingFile[]>([]);
  isSubmitting = signal(false);
  formStatus = signal<'idle' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');
  deletingId = signal<string | null>(null);

  hasAnyMedia = computed(
    () => this.existingImageUrls().length > 0 || this.pendingFiles().length > 0
  );

  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    longDescription: ['', Validators.required],
    serviceCategory: ['', Validators.required],
    client: ['', Validators.required],
    location: ['', Validators.required],
    lat: [''],
    lng: [''],
  });

  constructor() {
    this.firebaseService.watchProjects((projects) => this.clientProjects.set(projects));
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/' + LOGIN_PATH);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles: PendingFile[] = Array.from(input.files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));

    this.pendingFiles.update((current) => [...current, ...newFiles]);
    input.value = '';
  }

  removePendingFile(index: number): void {
    this.pendingFiles.update((current) => current.filter((_, i) => i !== index));
  }

  removeExistingImage(url: string): void {
    this.existingImageUrls.update((urls) => urls.filter((u) => u !== url));
  }

  isVideo(url: string): boolean {
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes('/video/upload/');
  }

  startEdit(project: StoredProject): void {
    this.editingId.set(project.id);
    this.existingImageUrls.set([...project.imageUrls]);
    this.pendingFiles.set([]);
    this.formStatus.set('idle');
    this.projectForm.setValue({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      serviceCategory: project.serviceCategory,
      client: project.client,
      location: project.location,
      lat: project.coordinates ? String(project.coordinates.lat) : '',
      lng: project.coordinates ? String(project.coordinates.lng) : '',
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.existingImageUrls.set([]);
    this.pendingFiles.set([]);
    this.projectForm.reset();
    this.formStatus.set('idle');
  }

  async deleteProject(project: StoredProject): Promise<void> {
    const confirmed = typeof window !== 'undefined'
      ? window.confirm(`Delete "${project.title}"? This can't be undone.`)
      : true;
    if (!confirmed) return;

    this.deletingId.set(project.id);
    try {
      await this.firebaseService.deleteProject(project.id);
      if (this.editingId() === project.id) {
        this.cancelEdit();
      }
    } catch (err) {
      alert('Could not delete this project. Please try again.');
      console.error(err);
    } finally {
      this.deletingId.set(null);
    }
  }

  private async uploadPendingFiles(): Promise<string[]> {
    const files = this.pendingFiles();
    const uploaded: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === 'done' && item.uploadedUrl) {
        uploaded.push(item.uploadedUrl);
        continue;
      }
      this.pendingFiles.update((list) =>
        list.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f))
      );
      try {
        const url = await this.firebaseService.uploadMedia(item.file, (pct) => {
          this.pendingFiles.update((list) =>
            list.map((f, idx) => (idx === i ? { ...f, progress: pct } : f))
          );
        });
        this.pendingFiles.update((list) =>
          list.map((f, idx) => (idx === i ? { ...f, status: 'done', uploadedUrl: url } : f))
        );
        uploaded.push(url);
      } catch (err: any) {
        this.pendingFiles.update((list) =>
          list.map((f, idx) =>
            idx === i ? { ...f, status: 'error', error: err?.message || 'Upload failed' } : f
          )
        );
        throw err;
      }
    }

    return uploaded;
  }

  async onSubmit(): Promise<void> {
    this.formStatus.set('idle');
    this.errorMessage.set('');

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    if (!this.hasAnyMedia()) {
      this.errorMessage.set('Add at least one photo or video of the project.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const newUrls = await this.uploadPendingFiles();
      const imageUrls = [...this.existingImageUrls(), ...newUrls];

      const raw = this.projectForm.getRawValue();
      const lat = raw.lat ? parseFloat(raw.lat) : NaN;
      const lng = raw.lng ? parseFloat(raw.lng) : NaN;

      const project: Project = {
        title: raw.title!,
        slug: '', // Firestore doc id is used for lookups internally; slug set below
        description: raw.description!,
        longDescription: raw.longDescription!,
        serviceCategory: raw.serviceCategory!,
        client: raw.client!,
        location: raw.location!,
        imageUrls,
        ...(Number.isFinite(lat) && Number.isFinite(lng) ? { coordinates: { lat, lng } } : {}),
      };
      project.slug = this.slugify(project.title);

      const existingId = this.editingId();
      if (existingId) {
        await this.firebaseService.updateProject(existingId, project);
      } else {
        await this.firebaseService.addProject(project);
      }

      this.formStatus.set('success');
      this.cancelEdit();
    } catch (err: any) {
      console.error(err);
      this.errorMessage.set(err?.message || 'Something went wrong. Please try again.');
      this.formStatus.set('error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private slugify(text: string): string {
    return (
      text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 7)
    );
  }
}
