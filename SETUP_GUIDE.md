# Setup Guide - Covenant University Lost & Found

This guide will help you set up and run the project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local installation: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud (recommended for beginners): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Step 1: Clone or Download the Project

If you have Git installed:
```bash
git clone <your-repository-url>
cd covenant-lost-found
```

Or download the ZIP file and extract it.

## Step 2: Install Dependencies

### Install Backend Dependencies
```bash
cd server
npm install
```

### Install Frontend Dependencies
```bash
cd ../client
npm install
```

## Step 3: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add `/cu-lostandfound` at the end of the URL

### Option B: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service:
   - Windows: MongoDB should start automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Your connection string will be: `mongodb://localhost:27017/cu-lostandfound`

## Step 4: Configure Environment Variables

### Backend Configuration

1. Navigate to the `server` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and update the values:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cu-lostandfound
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cu-lostandfound

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-change-this-to-something-random

# Email Configuration (optional for now)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Important**: Change `JWT_SECRET` to a random string. You can generate one using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Run the Application

You have two options:

### Option A: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
You should see: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
The browser should automatically open to `http://localhost:3000`

### Option B: Run Both Servers Together

From the root directory:
```bash
npm run install-all  # First time only
npm run dev
```

## Step 6: Test the Application

1. Open your browser to `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Use your Covenant University email format: `yourname@covenantuniversity.edu.ng`
4. Fill in the registration form
5. After registration, you'll be logged in automatically

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Check if MongoDB is running
- Verify your `MONGODB_URI` in `.env` is correct
- For Atlas: Make sure your IP is whitelisted (Network Access → Add IP Address → Allow Access from Anywhere)

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Issue: Email verification not working

**Solution:**
- In development mode, users are auto-verified
- For production, you'll need to set up email service (Gmail, SendGrid, etc.)

## Project Structure

```
covenant-lost-found/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── WIREFRAMES.md         # UI design documentation
├── PROJECT_PLAN.md       # Business plan
└── README.md
```

## Next Steps

1. **Create Test Data**: Register a few test accounts and create some lost/found items
2. **Customize**: Update colors, logos, and branding in the CSS files
3. **Deploy**: See DEPLOYMENT.md for deployment instructions
4. **Partnership**: Use PARTNERSHIP_PROPOSAL.md to approach CU Security

## Development Tips

### Hot Reload
Both frontend and backend support hot reload - changes will automatically refresh

### API Testing
- Backend API runs on: `http://localhost:5000/api`
- Test endpoints using Postman or Thunder Client (VS Code extension)

### Database Viewing
- Use MongoDB Compass to view your database visually
- Connection string: Same as your `MONGODB_URI`

### Debugging
- Backend logs appear in the terminal running `npm run dev`
- Frontend errors appear in browser console (F12)

## Available Scripts

### Backend (server/)
- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload

### Frontend (client/)
- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search for the error on Google/Stack Overflow
3. Check MongoDB connection
4. Verify all dependencies are installed
5. Make sure ports 3000 and 5000 are available

## Security Notes

⚠️ **Important for Production:**

1. Never commit `.env` file to Git
2. Change `JWT_SECRET` to a strong random string
3. Use HTTPS in production
4. Set up proper email verification
5. Add rate limiting to prevent abuse
6. Validate all user inputs

## Ready to Launch?

Once everything is working:
1. Test all features thoroughly
2. Get feedback from 5-10 friends
3. Approach CU Security with your proposal
4. Launch to a small group (100 students)
5. Iterate based on feedback
6. Scale campus-wide

Good luck with your project! 🚀
