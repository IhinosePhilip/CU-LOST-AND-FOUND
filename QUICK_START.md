# Quick Start Guide - Get Running in 10 Minutes

This is the fastest way to get your Covenant University Lost & Found platform running.

## Prerequisites Check

Do you have these installed? (Check by running these commands)

```bash
node --version    # Should show v16 or higher
npm --version     # Should show 8 or higher
git --version     # Should show any version
```

If any command fails, install the missing software first.

## Step 1: Get the Code (1 minute)

```bash
# Navigate to where you want the project
cd Desktop

# If you have the code already, skip to Step 2
# Otherwise, create the project folder
mkdir covenant-lost-found
cd covenant-lost-found
```

## Step 2: Install Everything (3 minutes)

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Go back to root
cd ..
```

## Step 3: Set Up Database (2 minutes)

### Option A: Use MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (it's free)
3. Create a cluster (choose FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Option B: Use Local MongoDB

If you have MongoDB installed locally:
```bash
# Your connection string is:
mongodb://localhost:27017/cu-lostandfound
```

## Step 4: Configure Backend (2 minutes)

```bash
cd server
```

Create a file named `.env` with this content:

```env
PORT=5000
MONGODB_URI=your-connection-string-here
JWT_SECRET=cu-lostandfound-secret-key-2026
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Replace `your-connection-string-here`** with:
- Your MongoDB Atlas connection string, OR
- `mongodb://localhost:27017/cu-lostandfound` for local

## Step 5: Run the App (2 minutes)

Open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Wait for: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Browser should open automatically to `http://localhost:3000`

## Step 6: Test It!

1. Click "Sign Up"
2. Fill in the form:
   - Email: `yourname@covenantuniversity.edu.ng`
   - Password: `password123`
   - Fill other fields
3. Click "Sign Up"
4. You should be logged in!

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env`
- For Atlas: Make sure you replaced `<password>` with your actual password
- For Atlas: Whitelist your IP (Network Access → Add IP → Allow from Anywhere)

### "Port 3000 already in use"
```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <number> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

### Still stuck?
1. Make sure you're in the right directory
2. Check that both terminals are running
3. Look at the error message carefully
4. Try restarting both servers

## What's Next?

✅ **You're running!** Now you can:

1. **Explore the app** - Browse items, report lost/found items
2. **Customize it** - Change colors in CSS files
3. **Read the docs** - Check `PROJECT_PLAN.md` for business strategy
4. **Deploy it** - See `DEPLOYMENT.md` (coming soon)
5. **Get users** - Use `PARTNERSHIP_PROPOSAL.md` to approach CU Security

## Project Structure

```
covenant-lost-found/
├── client/          # React frontend (runs on port 3000)
├── server/          # Node.js backend (runs on port 5000)
├── SETUP_GUIDE.md   # Detailed setup instructions
├── PROJECT_PLAN.md  # Business strategy
└── WIREFRAMES.md    # UI design documentation
```

## Common Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm start

# Install new package (backend)
cd server && npm install package-name

# Install new package (frontend)
cd client && npm install package-name
```

## Default Test Account

After registration, you can create test accounts:
- Email: `pihinose.260035@stu.cu.edu.ng`
- Password: `test123`

## Need More Help?

- **Detailed Setup**: Read `SETUP_GUIDE.md`
- **Business Plan**: Read `PROJECT_PLAN.md`
- **UI Design**: Read `WIREFRAMES.md`
- **Database Info**: Read `DATABASE_SCHEMA.md`

---

**You're all set! Start building your campus lost & found platform! 🚀**
