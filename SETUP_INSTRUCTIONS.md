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
5. Go to the **Rules** tab of Firestore and replace the rules with the
   block below. **Edit the email/phone list first** — put in your client's
   real email and/or phone number (the ones they'll actually sign up with):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /projects/{projectId} {
         allow read: if true;
         allow write: if request.auth != null && (
           request.auth.token.email in ['client@example.com'] ||
           request.auth.token.phone_number in ['+2348012345678']
         );
       }
     }
   }
   ```

   Click **Publish**. This means anyone can *view* projects (needed for the
   public site), but only someone signed in **and** on this list can add,
   edit, or delete one — even though sign-up itself is open to anyone.

   To authorize more than one person, just add more entries to either
   array, e.g. `['client@example.com', 'you@example.com']`.

6. Open `src/app-config.ts` in this repo and fill in the **same** emails
   and/or phone numbers in `AUTHORIZED_EMAILS` / `AUTHORIZED_PHONE_NUMBERS`.
   This list doesn't grant access by itself (step 5's rules do that) — it
   just makes the app show a clear "not authorized" message instead of a
   confusing error for anyone who signs up but isn't on the list.

7. Turn on the sign-in methods you want. In the left sidebar go to
   **Build → Authentication → Get started**, then on the **Sign-in method**
   tab enable:
   - **Email/Password** — toggle on, save.
   - **Google** — toggle on, pick a support email, save. Then go to
     **Authentication → Settings → Authorized domains** and add your real
     site domain (e.g. `your-site.com`) if it isn't already listed —
     Google sign-in will fail on any domain not in this list.
   - **Phone** — toggle on, save. Phone sign-in sends real SMS messages;
     Firebase's free tier includes a monthly quota, then charges per SMS
     (see Firebase's pricing page). The login page always shows the phone
     option; if you'd rather not enable Phone at all, that's fine too —
     anyone who tries it will just see a "Something went wrong" message,
     so only point your client at email or Google in that case.

   Your client now signs up themselves the first time (email/password,
   Google, or phone — whichever you enabled), instead of you creating
   their account manually.

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

## 3. Choose the hidden pages' addresses

Open `src/app-config.ts` and change `MANAGE_PROJECTS_PATH` and
`LOGIN_PATH` to something private and hard to guess (they can be anything,
e.g. `'manage-projects-8f2k1x'` and `'client-login-8f2k1x'`). These paths
being unguessable is a nice extra layer, but the real protection now is
the login from step 6 above.

## 4. Install, commit, and deploy

```
npm install
git add .
git commit -m "Add client project upload page"
git push
```

Vercel/Netlify will redeploy automatically. Once it's live, the client
goes to:

```
https://your-site.com/#/client-login-8f2k1x
```

and signs up themselves the first time — using the email address or phone
number you put on the authorized list in step 5/6 — then is taken to the
upload page automatically. Their session is remembered by the browser, so
they won't have to sign in every visit — only after they explicitly log
out or clear their browser data.

(Note the `#` — this site uses hash-based routing, so the `#` before the
path is required.)

## What the client will see

A page to sign up or sign in (email/password, Google, or phone — whichever
you enabled), then: a form with project title, descriptions, category,
client name, location, optional map coordinates, and a "click to upload"
box for photos and videos. Below the form is a list of everything they've
added, each with **Edit** and **Delete** buttons, plus a **Log Out**
button. Saved projects show up on the public `/projects` page
automatically, usually within a few seconds — no redeploy needed.

If someone who isn't on the authorized list signs up (on purpose or by
accident), they see a plain "your account isn't authorized" message
instead of the form — they can't view, add, or change any project data.

The 20 existing projects already in the code are untouched and keep
showing up alongside anything the client adds.

## If the client forgets their password

If they signed up with email/password: Firebase console → Authentication
→ Users → find their email → the "⋮" menu → **Reset password**, which
emails them a reset link. If they signed up with Google or phone, there's
no separate password to reset — they just sign in with Google or request
a new phone code.

## Authorizing someone new, or removing access

Edit the two places that list who's allowed to manage projects:
1. The Firestore rule in step 5 (this is what actually controls access)
2. `AUTHORIZED_EMAILS` / `AUTHORIZED_PHONE_NUMBERS` in `src/app-config.ts`
   (this only controls the friendly message, so keep it in sync)

Removing someone from both lists blocks their writes immediately, even if
they stay logged in — Firestore checks the rule on every request.
