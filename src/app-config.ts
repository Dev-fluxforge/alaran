// ─────────────────────────────────────────────────────────────────────────
// PROJECT UPLOAD CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────
// These values connect the site to Firebase (stores project text/data) and
// Cloudinary (stores uploaded images & videos). None of the values below
// are secret — they are meant to be used from the browser — but follow
// SETUP_INSTRUCTIONS.md to generate your own before deploying.
// ─────────────────────────────────────────────────────────────────────────

export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export const CLOUDINARY_CONFIG = {
  // Found on your Cloudinary Dashboard home page.
  cloudName: 'YOUR_CLOUDINARY_CLOUD_NAME',
  // The name you give the "Unsigned" upload preset you create.
  // See SETUP_INSTRUCTIONS.md, step 2.
  uploadPreset: 'alaran_project_uploads',
};

// The URL path (after the # in the address bar, because this site uses
// hash-based routing) where the client goes to add/edit/delete projects.
// Change this to something only you and the client know, e.g.
// 'manage-projects-8f2k1x'. Nobody else can guess it, and it is never
// linked to from anywhere on the public site.
export const MANAGE_PROJECTS_PATH = 'manage-projects-8f2k1x';
