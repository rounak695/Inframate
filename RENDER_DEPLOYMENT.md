# Render Backend Deployment Configuration

## ✅ Backend is Ready for Deployment

Your `package.json` already has the required scripts:
- `"build": "nest build"` ✅
- `"start:prod": "node dist/main"` ✅

---

## 🔐 Generated JWT Secrets (Use These for Render)

```
JWT_SECRET=4de9de27848491bfb3652057207bd7c59dcb735201b88d93d593e4d8d8800999
JWT_REFRESH_SECRET=931abd7db31c393a36753b3a958dbc0285950e07a92cbfb9144d672a447c5e9a
```

---

## 📋 Environment Variables for Render

Copy these when adding environment variables in Render:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

DATABASE_URL=postgresql://postgres.djdljbtrugcwqifefdmx:ytBudIT4UXVH7o8k@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

JWT_SECRET=4de9de27848491bfb3652057207bd7c59dcb735201b88d93d593e4d8d8800999
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=931abd7db31c393a36753b3a958dbc0285950e07a92cbfb9144d672a447c5e9a
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=https://your-frontend.vercel.app
```

**Note:** Update `CORS_ORIGIN` after you deploy the frontend to Vercel.

---

## 🚀 Manual Steps on Render.com

### Step 1: Create Account & Connect GitHub

1. Go to **https://render.com**
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your **INFRAMATE** repository
3. Configure:

```
Name: inframate-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Node

Build Command:
npm install && npm run build && npx prisma generate && npx prisma migrate deploy

Start Command:
npm run start:prod
```

### Step 3: Select Free Plan

- Choose **Free** (750 hours/month)
- ⚠️ Service will sleep after 15 minutes of inactivity

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable from the section above (one by one):
- NODE_ENV
- PORT
- API_PREFIX
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRES_IN
- CORS_ORIGIN

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait ~5 minutes for deployment
3. Watch logs for: `"🚀 Inframate Backend Server Started"`

---

## ✅ Verify Deployment

Once deployed, you'll get a URL like:
```
https://inframate-backend.onrender.com
```

**Test it:**
```bash
curl https://inframate-backend.onrender.com/api/v1/auth/login
```

Should return a 400 error (validation error) which means the server is running!

---

## 🗄️ Database Migrations (After Deployment)

### Option 1: Via Render Shell (Recommended)

1. Go to your service dashboard on Render
2. Click **"Shell"** tab (top right)
3. Run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Option 2: From Your Local Machine

```bash
cd backend
DATABASE_URL="postgresql://postgres.djdljbtrugcwqifefdmx:ytBudIT4UXVH7o8k@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true" npx prisma migrate deploy

DATABASE_URL="postgresql://postgres.djdljbtrugcwqifefdmx:ytBudIT4UXVH7o8k@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true" npm run prisma:seed
```

This will:
- Create all database tables
- Create demo campus
- Create 3 test users (admin, staff, student)
- Create sample issues

---

## 🎯 Next Step: Frontend Deployment

After backend is deployed:
1. Note your backend URL: `https://inframate-backend.onrender.com`
2. Update CORS_ORIGIN in Render to match your frontend URL
3. Deploy frontend to Vercel (next step in deployment guide)

---

## 🐛 Troubleshooting

**Issue: Build fails**
- Check Render logs for errors
- Ensure `backend/prisma/schema.prisma` exists
- Verify `DATABASE_URL` is correct

**Issue: Service is sleeping**
- This is normal on free tier
- First request will wake it up (~30 seconds)
- Upgrade to Starter plan (₹550/mo) for always-on

**Issue: Database connection error**
- Verify DATABASE_URL has `?pgbouncer=true` at the end
- Check Supabase connection pooler string (not direct connection)

---

**You're ready to deploy! 🚀**

Go to https://render.com and follow the steps above.
