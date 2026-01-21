# Inframate Onboarding Walkthrough

## Overview
The pilot onboarding flow simplifies new campus setup through a guided 4-step wizard.

## Onboarding Steps

### Step 1: Create Campus
1. Navigate to `/admin/onboarding`
2. Enter campus details:
   - Campus Name
   - Campus Code (unique identifier)
   - Location/Address
   - Contact information
3. Click "Next"

### Step 2: Add Categories
1. Review pre-populated default categories:
   - Electrical (⚡, Yellow, 24h SLA)
   - Plumbing (🚰, Blue, 48h SLA)
   - HVAC (❄️, Cyan, 72h SLA)
   - IT Support (💻, Purple, 4h SLA)
   - Maintenance (🔧, Orange, 168h SLA)
2. Customize as needed (add/edit/remove)
3. Bulk create all categories
4. Click "Next"

### Step 3: Invite Staff
1. Add staff members individually:
   - Email
   - First Name
   - Last Name
   - Role (STAFF or ADMIN)
   - Department (optional)
2. Click "Send Invitation"
3. Staff receives email with invitation link
4. Staff clicks link → completes registration with password
5. Repeat for all staff members
6. Click "Next"

### Step 4: Invite Students
1. Option A - Manual Entry:
   - Enter student details one by one
   - Same fields as staff
2. Option B - CSV Upload (future enhancement):
   - Upload CSV file with student data
   - Preview before bulk inviting
3. Click "Send Invitations"
4. Students receive invitation emails
5. Click "Complete Onboarding"

## Success Screen
- Summary of setup:
  - Campus created ✅
  - X categories added ✅
  - Y staff invited ✅
  - Z students invited ✅
- "Go to Dashboard" button

## Backend Endpoints

### Campus
- `POST /api/v1/campus` - Create campus

### Categories
- `POST /api/v1/categories/bulk` - Bulk create categories
  ```json
  {
    "campusId": "uuid",
    "categories": [
      {"name": "Electrical", "icon": "⚡", "color": "#FFC107", "slaHours": 24}
    ]
  }
  ```

### Invitations
- `POST /api/v1/invitations/invite` - Invite user
  ```json
  {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STAFF",
    "campusId": "uuid",
    "department": "IT"
  }
  ```
- `GET /api/v1/invitations/:token` - Validate token
- `POST /api/v1/invitations/:token/accept` - Accept invitation
  ```json
  {
    "password": "securepassword123"
  }
  ```

## Invitation Flow

### Admin Side
1. Admin fills invitation form
2. Backend generates secure token
3. Email sent to invitee with link: `/invite/:token`
4. Token expires in 7 days

### Invitee Side
1. Click email link
2. Redirected to `/invite/:token`
3. Frontend validates token
4. If valid, show registration form
5. User sets password
6. Account created, redirected to login

## Security
- **Admin-only**: Onboarding wizard restricted to ADMIN/SUPER_ADMIN roles
- **Token expiry**: Invitations expire after 7 days
- **Unique tokens**: Cryptographically secure random tokens
- **Email validation**: Prevents duplicate invitations
- **Rate limiting**: Standard rate limits apply (100 req/min)

## Default Categories
Pre-populated for convenience:

| Name | Icon | Color | SLA (hours) |
|------|------|-------|-------------|
| Electrical | ⚡ | Yellow (#FFC107) | 24 |
| Plumbing | 🚰 | Blue (#2196F3) | 48 |
| HVAC | ❄️ | Cyan (#00BCD4) | 72 |
| IT Support | 💻 | Purple (#9C27B0) | 4 |
| Maintenance | 🔧 | Orange (#FF9800) | 168 |

## Testing the Flow

### Local Testing
```bash
# 1. Login as admin
POST /api/v1/auth/login
{
  "email": "admin@demo.edu",
  "password": "password123"
}

# 2. Create campus
POST /api/v1/campus
{
  "name": "Test University",
  "code": "TEST-U",
  "location": "123 Main St"
}

# 3. Bulk create categories
POST /api/v1/categories/bulk
{
  "campusId": "<campus-id from step 2>",
  "categories": [...]
}

# 4. Invite staff
POST /api/v1/invitations/invite
{
  "email": "newstaff@test.edu",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "STAFF",
  "campusId": "<campus-id>"
}

# 5. Check emails (console in mock mode)
# 6. Visit invitation link from email
# 7. Complete registration
```

## Future Enhancements
- CSV upload for bulk student invitations
- Email template customization
- Progress saving (draft mode)
- Invitation resend functionality
- Role-based onboarding (different flows for different roles)
