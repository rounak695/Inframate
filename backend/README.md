# Inframate Backend

Production-grade multi-tenant campus infrastructure management API built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** with bcrypt password hashing
- 👥 **Multi-tenancy** with campus isolation
- 🎭 **RBAC** (Role-Based Access Control) with 4 roles
- ⏰ **SLA Tracking** with automated breach detection
- 📊 **Issue Lifecycle Management** with state machine validation
- 🔄 **Automated Cron Jobs** for SLA monitoring and auto-close
- 🛡️ **Rate Limiting** and security best practices
- ✅ **Input Validation** with class-validator

## Tech Stack

- **Framework:** NestJS 10
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma 5
- **Authentication:** JWT + Passport
- **Validation:** class-validator
- **Scheduling:** @nestjs/schedule

## Project Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators (@CurrentUser, @Roles)
│   │   ├── guards/          # Auth guards (JWT, RBAC, Campus)
│   │   ├── filters/         # Exception filters
│   │   └── types/           # TypeScript types
│   │
│   ├── database/            # Prisma configuration
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── campus/          # Campus management
│   │   ├── issues/          # Issue tracking
│   │   └── sla/             # SLA monitoring
│   │
│   ├── app.module.ts        # Root module
│   └── main.ts              # Entry point
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # DB migrations
│   └── seed.ts              # Seed data
│
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Installation

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/inframate"
   JWT_SECRET="your-super-secret-key"
   JWT_EXPIRES_IN="15m"
   ```

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed database (optional):**
   ```bash
   npm run prisma:seed
   ```

### Development

```bash
# Start development server with hot-reload
npm run start:dev

# View Prisma Studio (database GUI)
npm run prisma:studio
```

Server will start on `http://localhost:3000/api/v1`

### Production

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## API Endpoints

### Authentication
```
POST   /api/v1/auth/login      # Login with email/password
POST   /api/v1/auth/register   # Register new user
```

### Users
```
GET    /api/v1/users/me        # Get current user profile
GET    /api/v1/users           # List campus users (STAFF+)
GET    /api/v1/users/:id       # Get user by ID (STAFF+)
```

### Issues
```
POST   /api/v1/issues               # Create issue
GET    /api/v1/issues               # List issues (STAFF+)
GET    /api/v1/issues/my-created    # My created issues
GET    /api/v1/issues/my-assigned   # My assigned issues (STAFF+)
GET    /api/v1/issues/:id           # Get issue details
PATCH  /api/v1/issues/:id/assign    # Assign issue (STAFF+)
PATCH  /api/v1/issues/:id/status    # Update status
```

### Campus
```
GET    /api/v1/campuses        # List campuses (ADMIN+)
GET    /api/v1/campuses/:id    # Get campus details (ADMIN+)
```

## RBAC Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **STUDENT** | Issue creators | Create & view own issues |
| **STAFF** | Issue resolvers | Assign, resolve issues |
| **ADMIN** | Campus admins | Full campus management |
| **SUPER_ADMIN** | Platform admins | Cross-campus access |

## SLA System

### Automatic Breach Detection

- **Cron Schedule:** Every hour (`0 * * * *`)
- **Response SLA:** Time to assign issue
- **Resolution SLA:** Time to resolve issue

### Priority-Based Deadlines

| Priority | Response SLA | Resolution SLA |
|----------|--------------|----------------|
| CRITICAL | 1 hour | 4 hours |
| HIGH | 4 hours | 24 hours |
| MEDIUM | 24 hours | 72 hours |
| LOW | 48 hours | 7 days |

### Auto-Close

- **Schedule:** Daily at 9 AM
- **Rule:** Issues in RESOLVED status for >48 hours auto-close

## Database Schema

**Entities:** Campus, User, Category, Issue, Assignment, Comment, Attachment, Notification, AuditLog

**Key Features:**
- Multi-tenant design with `campusId` on all entities
- UUIDs for security
- Soft deletes
- Composite indexes for performance
- Audit trail for compliance

## Environment Variables

See `.env.example` for all available configuration options.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Security Features

- ✅ JWT tokens with short expiry (15 min)
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (100 req/min)
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Multi-tenant data isolation

## Scripts

```bash
npm run build          # Build for production
npm run start          # Start server
npm run start:dev      # Start with hot-reload
npm run start:prod     # Start production build
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database
npm run lint           # Lint code
npm run format         # Format code
```

## License

UNLICENSED - Private project

## Support

For issues or questions, contact the development team.
