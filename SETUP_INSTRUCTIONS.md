# Client Project Uploads — Setup Guide

This adds a hidden page to the site where your client can add, edit, and
delete projects themselves — with photo/video upload — without ever
touching code. No backend server was needed since the site is on
Vercel/Netlify: everything talks directly from the browser to two free
services:

- **Firebase (Firestore)** — stores each project's text info (title,
  description, category, etc).
- **Cloudinary** — stores the uploaded photos & videos, and automatically
  compresses/optimizes video for you (this replaces the manual ffmpeg step).

None of the keys you'll paste in below are secret — they're meant to be
used from the browser — so it's safe to commit them to the repo.

Do this once. It takes about 10–15 minutes.

## 1. Create a Firebase project (free)

1. Go to https://console.firebase.google.com and click **Add project**.
   Name it anything (e.g. "alaran-geo-service"). You can skip Google
   Analytics.
2. Once created, click the **`</>`  (Web)** icon on the project overview
   page to register a web app. Give it any nickname and click **Register app**.
3. Firebase shows you a `firebaseConfig` object. Copy the values into
   `src/app-config.ts` in this repo, replacing the `YOUR_...` placeholders
   in `FIREBASE_CONFIG`.
4. In the left sidebar, go to **Build → Firestore Database → Create database**.
   Choose **Start in production mode**, pick any region close to your
   users, and click **Enable**.
5. Go to the **Rules** tab of Firestore and replace the rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /projects/{projectId} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```

   Click **Publish**.

   ⚠️ **Note on security:** you asked for no login, so these rules let
   anyone who has the hidden upload-page link add, edit, or delete
   projects — there's no password check. That matches what you asked for,
   but it also means the link itself *is* the only protection. Don't post
   it publicly. If you ever want a lightweight PIN gate added on top (still
   no full login system) let me know — it's a small addition.

## 2. Create a Cloudinary account (free)

1. Sign up at https://cloudinary.com/users/register_free.
2. On your Dashboard home page, copy the **Cloud name** shown near the top.
   Paste it into `CLOUDINARY_CONFIG.cloudName` in `src/app-config.ts`.
3. Go to **Settings (gear icon) → Upload** tab → scroll to **Upload
   presets** → click **Add upload preset**.
   - Set **Signing Mode** to **Unsigned**.
   - Set **Folder** to `alaran-projects` (optional, keeps things tidy).
   - Under **Media Analysis and AI** / **Optimize** section, turn on
     automatic quality/format optimization if offered — this is what
     shrinks uploaded videos automatically.
   - Save, and copy the preset's **name** (shown at the top, e.g.
     `ml_default` or whatever you named it).
4. Paste that name into `CLOUDINARY_CONFIG.uploadPreset` in
   `src/app-config.ts`.

## 3. Choose the hidden page's address

Open `src/app-config.ts` and change `MANAGE_PROJECTS_PATH` to something
private and hard to guess, e.g. `'manage-projects-8f2k1x'`. This is the
only "login" — treat it like a password and share it with your client
directly rather than posting it anywhere.

## 4. Install, commit, and deploy

```
npm install
git add .
git commit -m "Add client project upload page"
git push
```

Vercel/Netlify will redeploy automatically. Once it's live, the upload
page is at:

```
https://your-site.com/#/manage-projects-8f2k1x
```

(Note the `#` — this site uses hash-based routing, so the `#` before the
path is required.)

## What the client will see

A simple form: project title, descriptions, category, client name,
location, optional map coordinates, and a "click to upload" box for
photos and videos. Below the form is a list of everything they've added,
each with **Edit** and **Delete** buttons. Saved projects show up on the
public `/projects` page automatically, usually within a few seconds —
no redeploy needed.

The 20 existing projects already in the code are untouched and keep
showing up alongside anything the client adds.
