# MongoDB Setup Guide

Since MongoDB is not installed locally on your system, you have two options:

## Option 1: Use MongoDB Atlas (Cloud - Recommended) ⭐

This is the easiest option and requires no local installation.

### Steps:

1. **Sign Up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Create an account (use your email)

2. **Create a Free Cluster**
   - Choose "Shared" (Free tier)
   - Select a cloud provider (AWS recommended)
   - Choose a region close to Nigeria (e.g., Frankfurt or London)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `cuadmin`
   - Password: Create a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://cuadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add `/cu-lostandfound` before the `?` to specify database name:
     ```
     mongodb+srv://cuadmin:yourpassword@cluster0.xxxxx.mongodb.net/cu-lostandfound?retryWrites=true&w=majority
     ```

6. **Update Your .env File**
   - Open `server/.env`
   - Replace the `MONGODB_URI` line with your connection string
   - Save the file

7. **Restart the Server**
   - Stop the backend server (Ctrl+C)
   - Start it again: `npm run dev`

---

## Option 2: Install MongoDB Locally

If you prefer to run MongoDB on your computer:

### For Windows:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows" and download the MSI installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Update .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/cu-lostandfound
   ```

### For Mac:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongod --version
```

### For Linux:

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Recommended: Use MongoDB Atlas

For a student project, MongoDB Atlas is better because:
- ✅ No installation needed
- ✅ Free tier is generous (512MB storage)
- ✅ Automatic backups
- ✅ Access from anywhere
- ✅ Built-in monitoring
- ✅ Easy to share with team members

---

## Troubleshooting

### "Authentication failed"
- Check your username and password in the connection string
- Make sure you created a database user (not just an Atlas account)

### "Connection timeout"
- Check Network Access settings in Atlas
- Make sure your IP is whitelisted

### "Cannot connect to localhost"
- Make sure MongoDB service is running
- Check if port 27017 is available

---

## Next Steps

Once MongoDB is set up:
1. Update `server/.env` with your connection string
2. Restart the backend server
3. You should see: `✅ Connected to MongoDB`
