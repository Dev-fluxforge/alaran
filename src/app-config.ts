// ─────────────────────────────────────────────────────────────────────────
// PROJECT UPLOAD CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────
// These values connect the site to Firebase (stores project text/data) and
// Cloudinary (stores uploaded images & videos). None of the values below
// are secret — they are meant to be used from the browser — but follow
// SETUP_INSTRUCTIONS.md to generate your own before deploying.
// ─────────────────────────────────────────────────────────────────────────

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD_ff55CzGazgTOLiFekcfzVUyXtbmlGS8',
  authDomain: 'a-gsl-1f942.firebaseapp.com',
  projectId: 'a-gsl-1f942',
  storageBucket: 'a-gsl-1f942.firebasestorage.app',
  messagingSenderId: '996396632065',
  appId: '1:996396632065:web:e9a03b44ecb1f85722d800',
};

export const CLOUDINARY_CONFIG = {
  // Found on your Cloudinary Dashboard home page.
  cloudName: 'wlrrtyk7',
  // The name you give the "Unsigned" upload preset you create.
  // See SETUP_INSTRUCTIONS.md, step 2.
  uploadPreset: 'alaran_project_uploads',
};

// The URL path (after the # in the address bar, because this site uses
// hash-based routing) where the client goes to add/edit/delete projects.
// Change this to something only you and the client know, e.g.
// 'manage-projects-8f2k1x'. Nobody else can guess it, and it is never
// linked to from anywhere on the public site. This page now also requires
// logging in (see SETUP_INSTRUCTIONS.md), so the hidden path is just an
// extra layer, not the only protection.
export const MANAGE_PROJECTS_PATH = 'manage-projects-8f2k1x';

// The URL path for the login page. Keep this private too, for the same
// reason as above.
export const LOGIN_PATH = 'client-login-8f2k1x';

// ─────────────────────────────────────────────────────────────────────────
// WHO IS ALLOWED TO ACTUALLY MANAGE PROJECTS
// ─────────────────────────────────────────────────────────────────────────
// The login page lets ANYONE create an account (email/password, Google, or
// phone) — that's what makes it self-service. But creating an account is
// not the same as being allowed to add/edit/delete projects: only the
// email addresses and phone numbers listed here are granted that access.
// Everyone else can sign up but will see a "not authorized" message.
//
// IMPORTANT: this list is for a friendlier message in the app only. The
// real enforcement happens in your Firestore security rules, which must
// list the same emails/phone numbers — see SETUP_INSTRUCTIONS.md.
export const AUTHORIZED_EMAILS: string[] = [
  // 'client@example.com',
];
export const AUTHORIZED_PHONE_NUMBERS: string[] = [
  // '+2348012345678',
];
