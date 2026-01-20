# Inframate

**Multi-tenant campus infrastructure management platform for IIT/AIC incubators**

> Production-ready MVP • Built for scale • ₹0–₹1k/month infrastructure cost

---

## The Problem

Indian campuses face a **broken infrastructure feedback loop**:

- **Students** report issues through multiple channels (WhatsApp groups, emails, phone calls) → chaos
- **Maintenance staff** have no centralized tracking → missed issues, duplicate work
- **Admins** lack visibility into what's broken, what's fixed, and response times → compliance risk

**Cost of inaction:**
- Average campus spends ₹2-5L annually on reactive maintenance
- 40% of infrastructure issues go unreported or forgotten
- No accountability → delayed fixes → student dissatisfaction

**Existing solutions:**
- Enterprise tools (ServiceNow, JIRA Service Desk) → ₹5L+ annually, complex setup
- Excel sheets → manual, error-prone, not scalable
- WhatsApp groups → untrackable, no SLA enforcement

---

## Our Solution

**Inframate** is a lightweight, multi-tenant SaaS platform built specifically for tier-2/tier-3 campuses and incubators.

### Core Value Props

1. **Student-first issue reporting**
   - Mobile-friendly interface (no app needed)
   - One-click issue creation with photo upload
   - Real-time status tracking

2. **Staff efficiency**
   - Automated assignment based on category
   - SLA-driven prioritization (critical issues flagged automatically)
   - Mobile-optimized technician dashboard

3. **Admin oversight**
   - Live analytics: response time, resolution rate, SLA compliance
   - Audit trail for compliance (NAAC, NIRF requirements)
   - Multi-campus management from single dashboard

### What Makes Us Different

✅ **Built for budget constraints** - Runs on ₹0/month for small campuses  
✅ **Zero training required** - Intuitive UX modeled after WhatsApp  
✅ **Compliance-ready** - Automated reports for NAAC/NIRF documentation  
✅ **Multi-tenant from day one** - One instance serves 100+ campuses  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRAMATE PLATFORM                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Student App]  [Staff App]  [Admin Dashboard]             │
│        ↓             ↓              ↓                        │
│  ┌──────────────────────────────────────────┐              │
│  │      Next.js Frontend (Vercel CDN)       │              │
│  └──────────────────────────────────────────┘              │
│                      ↓ HTTPS                                │
│  ┌──────────────────────────────────────────┐              │
│  │   NestJS Backend (Render/Railway)        │              │
│  │   • JWT Auth + RBAC                       │              │
│  │   • Issue Lifecycle Engine                │              │
│  │   • SLA Monitoring (Cron)                 │              │
│  │   • Multi-tenant Isolation                │              │
│  └──────────────────────────────────────────┘              │
│                      ↓ SQL                                  │
│  ┌──────────────────────────────────────────┐              │
│  │   PostgreSQL (Neon/Supabase)             │              │
│  │   • 9 Entities, Row-Level Security        │              │
│  │   • Automatic Backups                     │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **API-first** - Stateless frontend, all business logic in backend
2. **Multi-tenant by design** - Campus-level data isolation (GDPR-compliant)
3. **SLA-driven** - Automated escalations prevent issues from falling through cracks
4. **Production-grade** - Enterprise security on startup budget

---

## Tech Stack

### Backend
- **NestJS** (TypeScript) - Enterprise-grade Node.js framework
- **Prisma** - Type-safe ORM with automated migrations
- **PostgreSQL** - Production database with row-level security
- **JWT** - Stateless authentication
- **Cron Jobs** - Automated SLA breach detection

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors

### Infrastructure
- **Vercel** - Frontend hosting (global CDN)
- **Render/Railway** - Backend hosting
- **Neon/Supabase** - Managed PostgreSQL
- **Cloudinary** - Image/file storage (future)

**Why This Stack?**
- ✅ Production-ready with minimal DevOps
- ✅ Scales from 1 to 100+ campuses without rewrite
- ✅ ₹0 infrastructure cost on free tiers
- ✅ Modern, maintainable codebase (easy to hire for)

---

## Current Status

### ✅ Completed (Production-Ready)

**Backend API (NestJS)**
- Authentication & authorization (JWT + RBAC)
- Issue lifecycle management (6-state state machine)
- SLA calculation and breach detection
- Multi-tenant isolation (campus-scoped data)
- Automated cron jobs (hourly SLA checks, daily auto-close)
- Complete Prisma schema (9 entities, 15+ indexes)
- Database seed data for demo

**Frontend (Next.js)**
- Role-based dashboards (Student, Staff, Admin)
- Login with role-based routing
- Issue creation and tracking
- Real-time SLA indicators
- Responsive design (mobile-first)

**Documentation**
- Complete architecture design
- Database schema with rationale
- SLA lifecycle specification
- Deployment guide (step-by-step)
- API documentation

### 🚧 In Progress

- File upload for issue photos (Cloudinary integration)
- Email notifications (Resend.com)
- Advanced analytics dashboard

### 📋 Roadmap Q1 2026

- WhatsApp bot integration (students can report via WhatsApp)
- SMS alerts for critical SLA breaches
- Mobile app (React Native)
- QR code scanning for location tagging

---

## Deployment

### Free Tier Setup (₹0/month)

**Suitable for:** 1-10 campuses, <200 users

```bash
# 1. Database (Neon)
✓ 500MB PostgreSQL
✓ Serverless (scales to zero)

# 2. Backend (Render)
✓ 750 hrs/month (always-on with sleep mode)
✓ Auto-deploy from GitHub

# 3. Frontend (Vercel)
✓ 100GB bandwidth
✓ Global CDN
✓ Unlimited deploys
```

**Total:** ₹0/month (MVP validated)

### Scale Path

| Campuses | Users | Monthly Cost | Changes |
|----------|-------|--------------|---------|
| 1-10 | <200 | **₹0** | Free tiers |
| 10-30 | 200-500 | **₹2,200** | Paid backend (always-on) |
| 30-50 | 500-1000 | **₹3,800** | + Paid database (10GB) |
| 50-100 | 1000-2000 | **₹8,000** | + Vercel Pro, Redis cache |

**We stay within ₹1k/month until 30+ campuses** (revenue-positive at scale)

---

## Pilot Readiness

### Demo Environment

**Live at:** Coming soon (deploying this week)

**Test Credentials:**
```
Admin:   admin@demo.edu   / password123
Staff:   staff@demo.edu   / password123
Student: student@demo.edu / password123
```

### Pilot Onboarding (30 Minutes)

**Week 1: Setup**
1. Create campus account (5 min)
2. Add admin user (5 min)
3. Configure categories (Electrical, Plumbing, etc.) (10 min)
4. Add staff members (10 min)

**Week 2: Testing**
1. 5 students create test issues
2. Staff resolve issues
3. Admin reviews analytics

**Week 3: Go-Live**
1. Promote to all students (email/WhatsApp)
2. Train maintenance staff (1-hour session)
3. Monitor first 50 issues

**Expected Results:**
- 80% issue resolution within SLA (vs. current ~40%)
- 90% reduction in email/WhatsApp maintenance requests
- Compliance-ready audit trail from day one

---

## Metrics We Track

### For Campuses
- **Response Time:** Time to assign issue to staff
- **Resolution Time:** Time to mark issue as fixed
- **SLA Compliance:** % of issues resolved within deadline
- **Category Breakdown:** Which areas have most issues
- **Staff Performance:** Average resolution time per technician

### For Platform
- **Active Campuses:** Number of paying/trial customers
- **Monthly Active Users:** Students + Staff + Admins
- **Issues Resolved:** Total platform throughput
- **Average SLA Compliance:** Platform-wide quality metric

---

## Business Model

### Pricing (Launching Q2 2026)

**Free Tier**
- Up to 100 students
- 2 staff members
- 50 issues/month
- Email support

**Starter - ₹2,999/month**
- Up to 500 students
- 10 staff members
- Unlimited issues
- Priority support
- Custom branding

**Enterprise - ₹9,999/month**
- Unlimited students
- Unlimited staff
- Multi-campus (up to 5)
- Dedicated success manager
- Custom integrations
- SLA guarantee (99.9% uptime)

**Target Market:**
- 2,000+ engineering colleges in India
- 500+ IIT/AIC incubators
- 1,000+ polytechnic colleges

**Conservative Projections:**
- Year 1: 20 paid campuses → ₹7.2L ARR
- Year 2: 100 paid campuses → ₹36L ARR
- Year 3: 300 paid campuses → ₹1.08Cr ARR

---

## Competitive Advantage

| Feature | Inframate | ServiceNow | Excel/WhatsApp |
|---------|-----------|------------|----------------|
| **Setup Time** | 30 minutes | 3-6 months | Instant (chaotic) |
| **Annual Cost** | ₹36k | ₹5L+ | Free |
| **Mobile-First** | ✅ | ❌ | Partial |
| **SLA Automation** | ✅ | ✅ | ❌ |
| **Multi-Tenant** | ✅ | ❌ (single tenant) | N/A |
| **Indian Campus Focus** | ✅ | ❌ (global enterprise) | N/A |

**Our Moat:**
1. **Product-market fit for tier-2/3 campuses** (ignored by enterprise vendors)
2. **Economics at scale** (multi-tenant = 100x lower cost per customer)
3. **Domain expertise** (SLA rules tailored for campus infrastructure)

---

## Team & Execution

### Current Status
- **Technical Founder:** Full-stack developer (this codebase)
- **Tech Stack:** Production-ready, deployed in 30 min
- **Documentation:** Complete architecture, deployment, scaling

### Immediate Needs
1. **Co-founder (Business/Operations)** - Campus partnerships, pilot execution
2. **Pilot Campuses** - 3-5 campuses for validation (IIT/AIC incubators preferred)
3. **Funding** - ₹10-15L for 6-month runway (team + infrastructure)

### 6-Month Milestones
- **Month 1-2:** Deploy pilots, gather feedback
- **Month 3-4:** Iterate on feature requests, add notifications
- **Month 5-6:** Scale to 20 paying campuses, hire engineer

---

## Why Now?

1. **Post-COVID digitization** - Campuses are open to SaaS solutions
2. **NAAC/NIRF compliance** - Institutions need audit trails
3. **Budget constraints** - Campuses can't afford enterprise tools
4. **Mobile penetration** - 95% of students have smartphones

---

## Get Involved

### For Incubators/Mentors
- **Pilot partnership:** Test with your portfolio companies
- **Feedback:** Help shape MVP features
- **Network:** Intro to target campuses

### For Investors
- **Thesis:** B2B SaaS for Indian education infra (underserved market)
- **Traction:** Production-ready MVP, seeking pilot validation
- **Ask:** ₹10-15L seed for 6-month runway

### Contact
**Email:** your-email@inframate.com  
**LinkedIn:** [Your LinkedIn]  
**Demo:** [Deployed URL when ready]

---

## Technical Deep Dive

Full documentation available in `/docs`:

- [System Architecture](backend/README.md)
- [Database Schema](docs/database-schema.md)
- [SLA Lifecycle](docs/sla-lifecycle.md)
- [Deployment Guide](docs/deployment-guide.md)
- [API Documentation](backend/README.md)

**Code Quality:**
- TypeScript across the stack (type-safe)
- Comprehensive error handling
- Automated database migrations
- Production logging & monitoring hooks
- Security best practices (JWT, RBAC, input validation)

**Development Velocity:**
- Full-stack ownership (Frontend + Backend)
- Git-based CI/CD (auto-deploy on push)
- Modular architecture (easy to extend)

---

## License

**Proprietary** - All rights reserved

Contact for licensing inquiries.

---

**Built with ❤️ for Indian campuses**

*Making infrastructure management simple, transparent, and accountable.*
