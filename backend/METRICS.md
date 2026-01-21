# Inframate Metrics & Privacy

## Overview
Inframate collects basic usage and business metrics to improve the product. This document explains what we track, why, and how we protect your privacy.

## What We Track

### 1. Active Users
- **Daily Active Users (DAU)**: Number of users who logged in the last 24 hours
- **Weekly Active Users (WAU)**: Users active in the last 7 days
- **Monthly Active Users (MAU)**: Users active in the last 30 days
- **By Role**: Breakdown by role (STUDENT, STAFF, ADMIN)

**How**: We use the `lastLoginAt` timestamp on the User table.

### 2. Issue Metrics
- **Total Issues**: Count of all issues created
- **Recent Issues**: Issues created in a time period
- **By Category**: Which issue categories are most used
- **By Priority**: Distribution of HIGH/MEDIUM/LOW priority

**How**: We aggregate counts from the Issue table.

### 3. Resolution Metrics
- **Resolution Rate**: Percentage of issues resolved
- **Average Resolution Time**: Hours to resolve an issue
- **SLA Compliance**: Percentage resolved within SLA deadline

**How**: We calculate from Issue table timestamps and status.

## What We DON'T Track

❌ **No Personal Identifiable Information (PII)**
- No individual user behavior tracking
- No email addresses in metrics
- No names in metrics
- No specific issue content

❌ **No Third-Party Services**
- No Google Analytics
- No Mixpanel
- No Segment
- No external tracking pixels

❌ **No Cookies for Tracking**
- Only session cookies for authentication
- No advertising cookies
- No cross-site tracking

## Why We Track This

### Product Improvement
- Understand which features are used most
- Identify bottlenecks in resolution process
- Improve SLA management

### Campus Management
- Help admins understand usage patterns
- Identify peak usage times
- Allocate staff resources effectively

### Business Insights
- Measure platform health
- Track growth over time
- Identify areas needing attention

## Data Storage

### Where Data Lives
- All metrics calculated from our PostgreSQL database
- No separate analytics database
- Data stays on our infrastructure (Supabase)

### Data Retention
- User login timestamps: Kept for active user calculations
- Issue data: Kept indefinitely for historical analysis
- Aggregated metrics: Calculated on-demand, not stored separately

### Access Control
- Metrics dashboard: Admin/Super Admin only
- API endpoints: Protected by JWT + RBAC
- Raw database: Infrastructure admins only

## Privacy Safeguards

### Aggregation Only
All metrics are aggregate counts. We never expose:
- "User X did Y"
- "Issue Z was created by..."
- Individual behavior patterns

### Compliance
- **GDPR Compatible**: No personal data processing for marketing
- **FERPA Compliant**: Student data used only for service operation
- **Transparent**: This document explains everything we track

### Data Minimization
We only track what's necessary for:
- System health monitoring
- Product improvement
- Admin dashboards

## Opting Out

### Environment Variable
To disable metrics collection entirely:
```bash
DISABLE_METRICS=true
```

This will:
- Skip login timestamp updates
- Return empty metrics from API
- Show "Metrics disabled" in admin dashboard

### Impact of Opting Out
- No impact on core functionality
- Admin dashboard won't show usage stats
- Analytics page will be empty

## Data Usage Examples

### Good Use
✅ "We have 234 active users this week"  
✅ "Electrical issues are the most common (45%)"  
✅ "Average resolution time improved from 36h to 24h"  

### Bad Use (We Don't Do This)
❌ "Student john@uni.edu logs in every day"  
❌ "This specific student created 10 issues"  
❌ "User behavior: clicks, mouse movements, etc."

## Technical Implementation

### Backend
- `MetricsService`: Calculates aggregate metrics
- `AnalyticsController`: Exposes `/analytics/usage` endpoint
- Database queries: Simple COUNT and AVG operations

### No Tracking Code
- No frontend tracking scripts
- No event firing on user actions
- No analytics SDK or library

### API Response Example
```json
{
  "activeUsers": {
    "daily": 45,
    "weekly": 234,
    "monthly": 567
  },
  "issues": {
    "total": 1234,
    "recentCount": 56
  },
  "resolution": {
    "resolutionRate": 0.87,
    "avgResolutionHours": 24.5
  }
}
```

## Questions?

If you have questions about our metrics collection or privacy practices:
- Review the source code (open source)
- Contact your system administrator
- File an issue on GitHub

## Updates to This Document

We will update this document if we:
- Add new metrics
- Change tracking methods
- Modify data retention

**Last Updated**: January 2026  
**Version**: 1.0
