# Step-by-Step Guide: Uploading NEXVION AI Course to APKPure

This guide walks you through every step to publish your app on the **APKPure Developer Console**.

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have these items ready (all generated in `apkpure-submission/`):

- [x] **Release APK:** `apkpure-submission/NEXVION-AI-Course-release.apk`
- [x] **App Icon:** `apkpure-submission/icon-512.png` (512x512 PNG)
- [x] **Feature Graphic Banner:** `apkpure-submission/feature-graphic-1024x500.png` (1024x500 PNG)
- [x] **Screenshots:** in `apkpure-submission/screenshots/`
- [x] **Store Listing Texts:** in `apkpure-submission/STORE_LISTING.md`
- [x] **Privacy Policy URL:** `https://nexvion-ai.web.app/privacy-policy.html`

---

## 🚀 Step 1: Create or Sign In to APKPure Developer Console

1. Open your browser and navigate to the APKPure Developer Portal:
   👉 **[https://developer.apkpure.com](https://developer.apkpure.com)**
2. Click **Sign In** or **Register Developer Account**.
3. You can register using your email or Google account.
4. Verify your email address if prompted.

---

## 📤 Step 2: Add New Application & Upload the APK

1. In the **Developer Console Dashboard**, click the **"Add App"** or **"Publish App"** button (top right).
2. Choose **APK** as the package type.
3. Drag & drop or browse to select your release APK:
   ```
   course registration/apkpure-submission/NEXVION-AI-Course-release.apk
   ```
4. Wait for the upload and validation to complete. APKPure will automatically detect:
   - **Package Name:** `com.nexvion.course`
   - **Version Name:** `1.0`
   - **Version Code:** `1`
   - **Minimum SDK:** Android 7.0+ (API 24)
   - **Signature Scheme:** v1 + v2 signed

---

## 🎨 Step 3: Upload Visual Assets

Navigate to the **Store Presence / Graphics** tab:

1. **App Icon:**
   - Upload `apkpure-submission/icon-512.png` (512 × 512 px).
2. **Feature Graphic (Banner):**
   - Upload `apkpure-submission/feature-graphic-1024x500.png` (1024 × 500 px).
3. **Phone Screenshots:**
   - Upload screenshots from `apkpure-submission/screenshots/`:
     - `home-mobile.png`
     - `courses.png`
     - `home.png`
   - (Select at least 2 to 4 screenshots).

---

## ✍️ Step 4: Fill In App Details

Open `apkpure-submission/STORE_LISTING.md` and copy the details directly:

1. **App Name:** `NEXVION AI Course`
2. **Category:** `Education`
3. **Short Description:**
   > `Master Artificial Intelligence. Build real intelligent systems and agents.`
4. **Full Description:** Copy the text block from `STORE_LISTING.md`.
5. **Tags / Keywords:** `AI, Education, Machine Learning, Online Courses, Prompt Engineering`
6. **Content Rating:** Select `Everyone (3+)` (No violent or adult content).

---

## 🔒 Step 5: Privacy Policy & Developer Info

1. **Privacy Policy URL:**
   ```
   https://nexvion-ai.web.app/privacy-policy.html
   ```
2. **Developer Website:**
   ```
   https://nexvion-ai.web.app
   ```
3. **Support Email:**
   ```
   support@nexvion.ai
   ```

---

## ✅ Step 6: Submit for Review

1. Double-check all tabs (APK, Listing, Assets, Rating).
2. Click **"Submit for Review"** (or **"Publish"**).
3. **Review Timeline:**
   - APKPure automated security scan typically takes **10–30 minutes**.
   - Editorial approval typically takes **24 to 48 hours**.
   - Once approved, your app will be live with a dedicated download URL on `https://apkpure.com/nexvion-ai-course/com.nexvion.course`.

---

## 💡 Important: How App Updates Work

Because your APK is configured with Capacitor connected to `https://nexvion-ai.web.app`:
- **Instant Web Updates:** Whenever you update your courses, HTML, CSS, JavaScript, or backend on Firebase Hosting, all Android users see the latest version **instantly** when they open the app! You do **not** need to rebuild an APK or re-upload for content or design updates.
- **When do you need a new APK?** Only if you change native device permissions, app icon, or package configuration. When you do, simply increase `versionCode` in `build.gradle` (e.g. `2`, `3`) and upload the new APK to APKPure.
