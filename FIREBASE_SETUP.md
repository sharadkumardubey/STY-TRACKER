# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Study Tracker application.

## Prerequisites

- Google Account
- Node.js and pnpm installed
- Study Tracker application cloned

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., `study-tracker`)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

---

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname (e.g., `study-tracker-web`)
3. **Don't** check "Also set up Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. Copy the Firebase configuration object (you'll need this next)

---

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   > ⚠️ **Important**: Never commit `.env` to git! It's already in `.gitignore`.

---

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** authentication:
   - Click on **"Email/Password"** provider
   - Toggle **"Enable"** switch
   - Click **"Save"**

### Optional: Enable Phone Authentication

If you want phone number login:
1. Click on **"Phone"** provider
2. Toggle **"Enable"** switch
3. Add your phone numbers for testing (during development)
4. Configure reCAPTCHA settings
5. Click **"Save"**

---

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set rules next)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### Set Firestore Security Rules

Go to **Firestore Database** > **Rules** tab and paste:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read any user profile
      allow read: if isAuthenticated();

      // Users can only create/update their own profile
      // Admins can create/update any profile
      allow create: if isAuthenticated();
      allow update: if isOwner(userId) || isAdmin();

      // Only admins can delete users
      allow delete: if isAdmin();
    }

    // Topics collection
    match /topics/{topicId} {
      // Anyone authenticated can read topics
      allow read: if isAuthenticated();

      // Only admins can create/update/delete topics
      allow create, update, delete: if isAdmin();
    }

    // Topic progress collection
    match /topicProgress/{progressId} {
      // Users can read their own progress, admins can read all
      allow read: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());

      // Users can update their own progress, admins can update any
      allow create, update: if isAuthenticated() &&
                              (request.resource.data.userId == request.auth.uid || isAdmin());

      // Only admins can delete progress
      allow delete: if isAdmin();
    }

    // Results collection
    match /results/{resultId} {
      // Users can read their own results, admins can read all
      allow read: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());

      // Anyone authenticated can create results (for submitting assignments)
      allow create: if isAuthenticated();

      // Only admins can update/delete results
      allow update, delete: if isAdmin();
    }
  }
}
```

Click **"Publish"** to save the rules.

---

## Step 6: Create Firestore Indexes

Some queries require composite indexes. Create them in advance:

1. Go to **Firestore Database** > **Indexes** tab
2. Click **"Add Index"**
3. Create the following indexes:

### Index 1: Users by Role and Creation Date
- Collection ID: `users`
- Fields:
  - `role` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 2: Topics by User and Creation Date
- Collection ID: `topics`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 3: Results by Date
- Collection ID: `results`
- Fields:
  - `date` (Ascending)
  - `completedAt` (Descending)
- Query scope: Collection

### Index 4: Results by User ID
- Collection ID: `results`
- Fields:
  - `userId` (Ascending)
  - `completedAt` (Descending)
- Query scope: Collection

### Index 5: Results for Chart Data
- Collection ID: `results`
- Fields:
  - `date` (Ascending)
  - `date` (Ascending)
  - `date` (Ascending)
- Query scope: Collection
- Note: You may need to create this based on actual query errors

---

## Step 7: Create Admin User

You need to manually create the first admin user:

### Option A: Via Firebase Console

1. Go to **Build** > **Authentication** > **Users** tab
2. Click **"Add user"**
3. Enter email and password
4. Click **"Add user"**
5. Go to **Firestore Database**
6. Click on **"users"** collection
7. Click **"Add document"**
8. Set Document ID to the **User UID** from Authentication
9. Add fields:
   ```
   id: (string) <same as document ID>
   email: (string) admin@example.com
   name: (string) Admin User
   phone: (string) +1234567890
   role: (string) admin
   createdAt: (string) 2025-01-01
   ```
10. Click **"Save"**

### Option B: Via Code (after first setup)

After you can log in, run this script once:

```javascript
// Create in src/scripts/createAdmin.ts
import { authService } from './services/firebase/auth.service';

const createAdmin = async () => {
  try {
    const admin = await authService.signUp(
      'admin@example.com',
      'your-secure-password',
      'Admin User',
      '+1234567890',
      'admin'
    );
    console.log('Admin created:', admin);
  } catch (error) {
    console.error('Error:', error);
  }
};

createAdmin();
```

---

## Step 8: Switch to Firebase API

To use Firebase instead of dummy data, update your imports:

### In any component/page file:

**Before (Dummy API):**
```typescript
import { authAPI, usersAPI, topicsAPI } from '@/services/api';
```

**After (Firebase API):**
```typescript
import { authAPI, usersAPI, topicsAPI } from '@/services/api.firebase';
```

### Or globally update all at once:

Rename the files:
```bash
mv src/services/api.ts src/services/api.dummy.ts
mv src/services/api.firebase.ts src/services/api.ts
```

Then all existing imports will automatically use Firebase!

---

## Step 9: Test the Application

1. Start the dev server:
   ```bash
   pnpm dev
   ```

2. Open `http://localhost:5174`

3. Test authentication:
   - Try logging in with admin credentials
   - Try creating a new user
   - Verify data in Firebase Console

4. Test data operations:
   - Create some users
   - Assign topics to users
   - Mark topics as complete
   - View calendar progress

---

## Firestore Database Structure

Your Firestore will have these collections:

```
📁 users/
  📄 {userId}
    - id: string
    - name: string
    - email: string
    - phone: string
    - role: 'admin' | 'user'
    - createdAt: string

📁 topics/
  📄 {topicId}
    - id: string
    - userId: string
    - topics: array<{id, title, url}>
    - createdAt: string (ISO timestamp)

📁 topicProgress/
  📄 {userId}_{topicId}_{topicItemId}
    - userId: string
    - topicId: string
    - topicItemId: string
    - completed: boolean
    - completedAt: string (ISO date)
    - updatedAt: string (ISO timestamp)

📁 results/
  📄 {resultId}
    - id: string
    - userId: string
    - userName: string
    - topicId: string
    - topicTitle: string
    - score: number
    - completedAt: string (ISO timestamp)
    - date: string (YYYY-MM-DD)
```

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure user is authenticated
- Verify user role in Firestore

### Error: "Requires an index"
- Click the link in the error message to auto-create the index
- Or manually create the index as described in Step 6

### Error: "Configuration object is not valid"
- Double-check your `.env` file
- Make sure all values are copied correctly from Firebase Console
- Restart dev server after changing `.env`

### Authentication not working
- Verify Email/Password is enabled in Firebase Console
- Check network tab for API errors
- Make sure user document exists in Firestore

---

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables
   - Others: Check their documentation

2. Update Firestore rules if needed for production

3. Enable billing in Firebase (free tier is generous)

4. Monitor usage in Firebase Console

---

## Security Best Practices

✅ **DO:**
- Keep `.env` file in `.gitignore`
- Use environment variables for all config
- Review Firestore security rules carefully
- Enable App Check in production
- Monitor authentication logs

❌ **DON'T:**
- Commit API keys to git
- Allow unrestricted Firestore access
- Use same Firebase project for dev and prod
- Expose admin credentials

---

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## Summary Checklist

- [ ] Create Firebase project
- [ ] Register web app
- [ ] Configure environment variables (`.env`)
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Set Firestore security rules
- [ ] Create Firestore indexes
- [ ] Create admin user
- [ ] Switch to Firebase API
- [ ] Test the application
- [ ] Deploy to production

---

**Happy coding! 🚀**
