# Cardly Gym — PWA (cardly.in/gym)

A static, offline-first Progressive Web App for workouts and Indian diet plans.
No build step, no frameworks, no server — plain HTML/CSS/JS that runs on any modern mobile browser
(Chrome, Safari on iOS, Samsung Internet, Firefox, Edge) and installs to the home screen.

## Features
- **Multiple profiles**: each family member gets their own workout plans, diet, and history (switch from the top-right avatar).
- **Personalised suggestions** from name, age, gender, height, weight, goal, experience, days/week, session time, equipment, and focus area.
  Older users, a high BMI, or the joint-issues option give an automatic low-impact plan.
- **Day-wise plans**: weekly schedule with day splits (full body / upper-lower / push-pull-legs), plus rest-day guidance.
- **Part-wise suggestions**: chest, back, shoulders, arms, legs, glutes, core, cardio, each with a "recommended routine for you".
- **57 exercises with animated demos**: SVG animations with the target muscles highlighted, phase cues (inhale/exhale), and speed control.
  Each has a starting position, steps, body positioning (head/back/hands/feet), common mistakes, breathing, and coach tips.
- **My plans**: create, edit, reorder, set sets/reps/rest, duplicate, delete.
- **Workout mode**: set check-offs, a rest timer (vibration and beep), and workout history.
- **Indian diet plans**: 7-day meal plans (veg, eggetarian, non-veg, vegan, Jain; North/South/West/East cuisine)
  matched to calorie and protein targets (Mifflin-St Jeor BMR, Asian-Indian BMI scale). Any meal can be swapped.
- **Export**: workout plan to PDF/print, CSV (Excel), text share (WhatsApp), and .json (re-importable). Diet plan to PDF or text.
  You can also export a full backup and restore it.
- **Storage**: everything stays in `localStorage` on the device. Nothing is sent anywhere.

## Folder layout
```
index.html              app shell
manifest.webmanifest    PWA manifest (relative paths, so it works under /gym/)
sw.js                   service worker (offline cache)
css/app.css
js/anim.js              stick-figure animation engine
js/exercises.js         exercise library + animation keyframes
js/diet.js              Indian meal database
js/app.js               app logic and UI
icons/                  app icons
.nojekyll               tells GitHub Pages to serve files as-is
```

## Deploy to cardly.in/gym with GitHub Pages
All paths are relative, so the app works from any sub-folder.

**Option A: cardly.in is already a GitHub Pages site (recommended)**
If `cardly.in` is served by a GitHub Pages *user/organisation* site (a repo named `<username>.github.io` with a `CNAME` of `cardly.in`):
1. Create a new repo named **`gym`** under the same account.
2. Upload the contents of this folder to the repo root.
3. Go to Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save.
4. In a minute it is live at **https://cardly.in/gym/**. Project repos inherit the custom domain automatically.

**Option B: add it to the existing site repo**
Put this whole folder inside the site's repo as `/gym/`, then commit and push. It is served at `https://cardly.in/gym/`.

**Option C: cardly.in is hosted elsewhere**
Upload this folder to the `/gym/` directory of that web server. It must be served over **HTTPS** for install and offline support to work.

## Updating
After you change any file, bump `VERSION` in `sw.js` (for example `cardly-gym-v1.0.1`) so installed apps pick up the new files.

## Test locally
```
cd ..            # parent of this folder
python3 -m http.server 8080
# open http://localhost:8080/GYM/  (or whatever this folder is named)
```

## Disclaimer
This is general fitness information, not medical advice. Users with health conditions should consult a doctor.
