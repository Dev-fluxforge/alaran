import { Injectable } from '@angular/core';
import {
  getFirestore,
  Firestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  CollectionReference,
} from 'firebase/firestore';
import { getFirebaseApp } from './firebase-app';
import { CLOUDINARY_CONFIG } from './app-config';
import { Project } from './data.service';

export interface StoredProject extends Project {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: Firestore | null = null;
  private projectsCol: CollectionReference | null = null;
  isConfigured = false;

  constructor() {
    const app = getFirebaseApp();
    if (!app) {
      console.warn(
        '[Alaran] Firebase is not configured yet — see SETUP_INSTRUCTIONS.md. ' +
          'Client-uploaded projects will not appear until this is set up.'
      );
      return;
    }
    try {
      // This project's Cloud Firestore database is named "default" (not the
      // special "(default)" database), so it must be targeted explicitly.
      this.db = getFirestore(app, 'default');
      this.projectsCol = collection(this.db, 'projects');
      this.isConfigured = true;
    } catch (err) {
      console.error('[Alaran] Firebase failed to initialize:', err);
    }
  }

  /**
   * Subscribes to the live "projects" collection. Calls onChange every time
   * a project is added, edited, or removed (including the very first load).
   * Returns an unsubscribe function.
   */
  watchProjects(onChange: (projects: StoredProject[]) => void): () => void {
    if (!this.projectsCol) return () => {};
    return onSnapshot(
      this.projectsCol,
      (snapshot) => {
        const projects = snapshot.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Project) }) as StoredProject
        );
        onChange(projects);
      },
      (err) => console.error('[Alaran] Error loading projects from Firestore:', err)
    );
  }

  async addProject(project: Project): Promise<string> {
    if (!this.projectsCol) throw new Error('Firebase is not configured yet.');
    const ref = await addDoc(this.projectsCol, project);
    return ref.id;
  }

  async updateProject(id: string, project: Project): Promise<void> {
    if (!this.db) throw new Error('Firebase is not configured yet.');
    await updateDoc(doc(this.db, 'projects', id), { ...project });
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.db) throw new Error('Firebase is not configured yet.');
    await deleteDoc(doc(this.db, 'projects', id));
  }

  /**
   * Uploads one image or video file to Cloudinary and returns its public URL.
   * Works for both images and videos via Cloudinary's "auto" resource type.
   */
  uploadMedia(file: File, onProgress?: (pct: number) => void): Promise<string> {
    if (CLOUDINARY_CONFIG.cloudName.startsWith('YOUR_')) {
      return Promise.reject(
        new Error('Cloudinary is not configured yet — see SETUP_INSTRUCTIONS.md.')
      );
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`
      );
      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url as string);
          } catch {
            reject(new Error('Unexpected response from Cloudinary.'));
          }
        } else {
          reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error during upload.'));
      xhr.send(formData);
    });
  }
}
