# Study Tracker Application

A comprehensive study tracking application built with React, TypeScript, Redux Toolkit, and shadcn/ui components.

## Features

### Admin Features
- **Dashboard**: View charts showing progress (day/week/month/year wise) with score trends and completion counts
- **Results**: Date-wise results viewing with calendar-based selection
- **Topics Management**: Add topics with dynamic form fields (title + URL), assign to users
- **Progress Calendar**: Visual calendar with color-coded daily progress tracking
  - 🟢 Green: 100% completion (all topics completed)
  - 🟡 Yellow/Lime: 50-99% completion (partial progress)
  - 🟠 Orange: 25-49% completion
  - 🔴 Red: 0-24% completion (little to no progress)
  - Click any date to see detailed breakdown per user
- **User Management**: Full CRUD operations for users (create, read, update, delete)

### User Features
- **Dashboard**: View assigned topics with completion status
- **Topic Details**: Click on topics to see details in a modal
- **Progress Tracking**: Mark topics as completed

### Mobile Responsive
- ✅ Fully responsive design for all screen sizes
- 📱 Mobile-friendly navigation with hamburger menu
- 🎨 Touch-optimized UI components
- 📊 Responsive charts and tables

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router v7
- **State Management**: Redux Toolkit
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Firebase account (free tier works great)

### Installation

```bash
# Install dependencies
pnpm install

# Set up Firebase (follow detailed guide in FIREBASE_SETUP.md)
# 1. Create Firebase project
# 2. Enable Authentication (Email/Password)
# 3. Create Firestore database
# 4. Copy configuration to .env

# Create .env file
cp .env.example .env
# Then edit .env with your Firebase credentials

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Firebase Setup

📖 **[Complete Firebase Setup Guide](FIREBASE_SETUP.md)**

Quick summary:
1. Create a Firebase project
2. Enable Email/Password authentication
3. Create Firestore database
4. Configure environment variables in `.env`
5. Set up security rules and indexes
6. Create your first admin user

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed step-by-step instructions.

## Demo Credentials

### Development Mode (Dummy Data)
By default, the app uses dummy data for quick testing:
- **Admin**: `admin` / `admin`
- **User**: `john@example.com` / any password

### Firebase Mode (Production)
After setting up Firebase, use the credentials you created:
- **Admin**: email and password you set during admin user creation
- **Users**: registered user emails and passwords

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   │   ├── Dashboard.tsx
│   │   ├── Results.tsx
│   │   ├── Topics.tsx
│   │   ├── CalendarPage.tsx
│   │   └── Users.tsx
│   ├── user/           # User pages
│   │   └── Dashboard.tsx
│   └── Login.tsx       # Login page
├── services/           # API services
│   ├── api.ts          # Dummy API (development)
│   ├── api.firebase.ts # Firebase API (production)
│   └── firebase/       # Firebase service modules
│       ├── auth.service.ts
│       ├── users.service.ts
│       ├── topics.service.ts
│       ├── results.service.ts
│       └── calendar.service.ts
├── config/
│   └── firebase.ts     # Firebase configuration
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   │   ├── authSlice.ts
│   │   ├── usersSlice.ts
│   │   ├── topicsSlice.ts
│   │   └── resultsSlice.ts
│   ├── hooks.ts        # Typed Redux hooks
│   └── index.ts        # Store configuration
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## API Integration

The application supports **two modes**:

### 1. Development Mode (Dummy Data)
Uses `src/services/api.ts` with in-memory dummy data. Great for:
- Quick testing
- UI development
- No backend setup needed

### 2. Firebase Mode (Production)
Uses `src/services/api.firebase.ts` with Firebase backend. Features:
- Real authentication
- Persistent data storage
- Security rules
- Scalable infrastructure

### Switching Between Modes

**Option A: Per-file imports**
```typescript
// Use dummy data
import { authAPI } from '@/services/api';

// Use Firebase
import { authAPI } from '@/services/api.firebase';
```

**Option B: Global switch**
```bash
# Rename files to switch globally
mv src/services/api.ts src/services/api.dummy.ts
mv src/services/api.firebase.ts src/services/api.ts
```

### Firebase Collections & Structure:

**Auth:**
- `POST /api/auth/login` - Login with phone/email and password

**Users:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Topics:**
- `GET /api/topics` - Get all topics
- `GET /api/topics/user/:userId` - Get topics by user
- `POST /api/topics` - Create topics
- `GET /api/topics/progress/:userId` - Get user progress
- `PUT /api/topics/progress` - Update progress

**Results:**
- `GET /api/results?date=YYYY-MM-DD` - Get results by date
- `GET /api/results/chart?period=day|week|month|year` - Get chart data

**Calendar:**
- `GET /api/calendar/progress?year=YYYY&month=MM` - Get monthly progress for all users
- `GET /api/calendar/user/:userId?year=YYYY&month=MM` - Get user-specific monthly progress

## Future Enhancements

- [ ] Implement real API integration
- [ ] Add iframe support for embedded MCQ/coding questions
- [ ] Implement calendar events and scheduling
- [ ] Add notification system
- [ ] Implement topic scoring system
- [ ] Add export functionality for results
- [ ] Implement search and filtering
- [ ] Add user profile pages
- [ ] Implement deadline tracking

## Development Notes

- All forms use controlled components with React state
- Redux is used for global state management
- Protected routes check user authentication and roles
- Responsive design using Tailwind CSS
- Component library follows shadcn/ui patterns

## License

MIT

