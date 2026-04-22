# Deployment Guide — Make CU Lost & Found Live

## Overview
- **Database** → MongoDB Atlas (free)
- **Backend**  → Render.com (free)
- **Frontend** → Vercel (free)

Total cost: ₦0

---

## STEP 1 — Push code to GitHub

### 1a. Create a GitHub account
Go to https://github.com and sign up if you don't have an account.

### 1b. Create a new repository
1. Click the **+** icon → **New repository**
2. Name it: `cu-lost-and-found`
3. Set to **Public** (required for free Render hosting)
4. Click **Create repository**

### 1c. Push your code
Open a terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - CU Lost and Found"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cu-lost-and-found.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## STEP 2 — Set up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Try Free** → Sign up
3. Choose **Free (M0)** tier → Select any region → **Create**
4. **Security setup:**
   - Create a database user: username + strong password (save these!)
   - Under **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
5. **Get connection string:**
   - Click **Connect** → **Drivers**
   - Copy the string — looks like:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
     ```
   - Add your database name at the end:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cu-lostandfound?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

---

## STEP 3 — Deploy Backend on Render.com

1. Go to https://render.com → Sign up with GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repo: `cu-lost-and-found`
4. Configure:
   - **Name**: `cu-lostandfound-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (see below) |
   | `CLIENT_URL` | `https://your-app.vercel.app` (fill after Step 4) |
   | `ADMIN_EMAIL` | `admin@stu.cu.edu.ng` |
   | `ADMIN_PASSWORD` | a strong password you'll remember |

   **Generate JWT_SECRET** — run this in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and paste it as the JWT_SECRET value.

6. Click **Create Web Service**
7. Wait ~3 minutes for it to deploy
8. Copy your backend URL — looks like: `https://cu-lostandfound-api.onrender.com`

---

## STEP 4 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Sign up with GitHub
2. Click **Add New** → **Project**
3. Import your `cu-lost-and-found` repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variable:**

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://cu-lostandfound-api.onrender.com` |

   (Use your actual Render URL from Step 3)

6. Click **Deploy**
7. Wait ~2 minutes
8. Your live URL will be: `https://cu-lost-and-found.vercel.app`

---

## STEP 5 — Update Backend CORS

Go back to Render.com → your service → **Environment**:
- Update `CLIENT_URL` to your actual Vercel URL
- Click **Save Changes** — Render will redeploy automatically

---

## STEP 6 — Test Your Live App

1. Open your Vercel URL
2. Register a test account with a CU email
3. Report a lost item
4. Login as admin: `admin@stu.cu.edu.ng` / your admin password
5. Check the admin panel — you should see the registered user

---

## After Deployment

### Your live URLs will be:
- **App**: `https://cu-lost-and-found.vercel.app`
- **API**: `https://cu-lostandfound-api.onrender.com`
- **Admin**: `https://cu-lost-and-found.vercel.app/admin`

### Important notes:
- **Free Render tier sleeps after 15 mins of inactivity** — first request after sleep takes ~30 seconds to wake up. Upgrade to paid ($7/month) to avoid this.
- **MongoDB Atlas free tier** gives 512MB storage — enough for thousands of items.
- **Vercel** is always fast, no sleep issues.

### To update the app after changes:
```bash
git add .
git commit -m "Update: description of changes"
git push
```
Vercel and Render will automatically redeploy.

---

## Troubleshooting

**"Application error" on Render:**
- Check Render logs (Dashboard → your service → Logs)
- Usually a missing environment variable

**Frontend can't reach backend:**
- Check `REACT_APP_API_URL` is set correctly in Vercel
- Check `CLIENT_URL` matches your Vercel URL in Render

**MongoDB connection failed:**
- Check your Atlas IP whitelist includes 0.0.0.0/0
- Verify the connection string has the correct password

**Admin panel not showing:**
- Log out and log back in after first deploy
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars on Render
