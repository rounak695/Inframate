# Inframate Frontend

Production-grade Next.js frontend for the Inframate campus infrastructure management platform.

## Features

- 🔐 **JWT Authentication** with role-based access
- 🎭 **Role-Based Dashboards** (Student, Staff, Admin)
- 📱 **Responsive Design** with Tailwind CSS
- ⚡ **API-Driven** with axios client
- 🛡️ **Protected Routes** with authentication guards
- 🎨 **Clean UI** without heavy component libraries

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Context
- **Icons:** Unicode Emojis (zero dependencies)

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── admin/                # Admin dashboard
│   │   ├── staff/                # Staff dashboard
│   │   ├── student/              # Student dashboard
│   │   ├── login/                # Login page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Root page (redirects to login)
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # Reusable components
│   │   ├── dashboard-layout.tsx  # Main layout with sidebar
│   │   ├── issue-card.tsx        # Issue display card
│   │   └── with-auth.tsx         # Protected route HOC
│   │
│   ├── contexts/                 # React contexts
│   │   └── auth-context.tsx      # Authentication state
│   │
│   └── lib/                      # Utilities
│       └── api-client.ts         # Axios client & API methods
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on port 3000

### Installation

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3001
   ```

## Routes

### Public Routes
```
/                  → Redirects to /login
/login             → Login page
```

### Protected Routes (Student)
```
/student           → My issues dashboard
/student/create    → Create new issue
```

### Protected Routes (Staff)
```
/staff             → Assigned issues dashboard
/staff/issues      → All campus issues
```

### Protected Routes (Admin)
```
/admin             → Admin dashboard with stats
/admin/issues      → All issues management
/admin/users       → User management
/admin/categories  → Category management
```

## Authentication Flow

1. **User visits site** → Redirected to `/login`
2. **Login with credentials** → JWT token stored in localStorage
3. **Role-based redirect:**
   - STUDENT → `/student`
   - STAFF → `/staff`
   - ADMIN → `/admin`
4. **Protected routes check:**
   - If not authenticated → redirect to `/login`
   - If wrong role → redirect to `/unauthorized`

## API Integration Pattern

### Setup
```typescript
// lib/api-client.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Auto-inject JWT token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Usage in Components
```typescript
'use client';

import { useState, useEffect } from 'react';
import { issuesApi } from '@/lib/api-client';

export default function MyComponent() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const data = await issuesApi.getAll();
    setIssues(data);
  };

  return <div>{/* Render issues */}</div>;
}
```

## Components

### Dashboard Layout
```tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function MyPage() {
  return (
    <DashboardLayout title="My Page">
      {/* Content */}
    </DashboardLayout>
  );
}
```

### Protected Routes
```tsx
import { withAuth } from '@/components/with-auth';

function MyPage() {
  return <div>Protected content</div>;
}

export default withAuth(MyPage, ['ADMIN', 'STAFF']); // Only these roles
```

### Issue Card
```tsx
import { IssueCard } from '@/components/issue-card';

<IssueCard 
  issue={issueData} 
  showActions={true}  // Show action buttons
  isAdmin={false}      // Admin mode
/>
```

## Styling with Tailwind

### Utility Classes Defined
```css
.btn              → Base button styles
.btn-primary      → Primary button (blue)
.btn-secondary    → Secondary button (gray)
.card             → White card with shadow
.input            → Form input field
.badge            → Pill-shaped badge
.badge-success    → Green badge
.badge-warning    → Yellow badge
.badge-error      → Red badge
.badge-info       → Blue badge
```

### Usage
```tsx
<button className="btn btn-primary">
  Click me
</button>

<div className="card">
  <h2>Card Title</h2>
</div>

<span className="badge badge-success">
  Active
</span>
```

## Environment Variables

```env
# API endpoint (backend)
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

## Deployment (Vercel)

1. **Push to GitHub**
2. **Import project in Vercel**
3. **Set environment variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
   ```
4. **Deploy**

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Login Credentials (Demo)

```
Student: student@demo.edu / password123
Staff:   staff@demo.edu / password123
Admin:   admin@demo.edu / password123
```

## Features Implemented

✅ JWT authentication with role-based routing  
✅ Student dashboard (view own issues)  
✅ Staff dashboard (assigned issues + stats)  
✅ Admin dashboard (all issues + filters)  
✅ Create issue form  
✅ Protected routes with HOC  
✅ API client with interceptors  
✅ Auth context with useAuth hook  
✅ Responsive dashboard layout  
✅ Issue cards with status badges  
✅ SLA breach indicators  

## Features TODO

❌ Issue details page  
❌ Issue assignment (admin/staff)  
❌ Status updates (staff)  
❌ Comments on issues  
❌ File uploads  
❌ User management (admin)  
❌ Category management (admin)  
❌ Notifications  
❌ Real-time updates  

## License

UNLICENSED - Private project

## Support

For issues or questions, contact the development team.
