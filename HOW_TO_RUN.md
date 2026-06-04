# SecurePay — How to Run

## What's inside
- `server/` → Node.js + Express backend (port 5000)
- `client/` → React + Vite frontend (port 5173)

---

## Step 1 — Make sure you have these installed
- Node.js v18+  → https://nodejs.org
- MongoDB       → https://www.mongodb.com/try/download/community
- VS Code       → https://code.visualstudio.com

---

## Step 2 — Open in VS Code
Open the `securepay` folder (this folder) in VS Code.
Then open 3 terminals: Terminal → New Terminal, then click + twice more.

---

## Step 3 — Start MongoDB (Terminal 1)
```
mongod
```
On Windows it may already run as a service — skip if so.

---

## Step 4 — Install and start the backend (Terminal 2)
```
cd server
npm install
npm run dev
```
✅ You should see: "SecurePay server running on port 5000"

---

## Step 5 — Install and start the frontend (Terminal 3)
```
cd client
npm install
npm run dev
```
✅ You should see: "Local: http://localhost:5173"

---

## Step 6 — Open the app
Go to http://localhost:5173 in your browser.

1. Click "Get Started" → Register a new account
2. On the dashboard click "Add ₹1000 (Demo)" to add money
3. Open an incognito tab → register a second user
4. Go back to user 1 → click Transfer → search for user 2's email → send money
5. Check user 2's dashboard — balance updated in real time!

---

## How to become Admin
1. Open MongoDB Compass → connect to localhost:27017
2. Open the `securepay` database → `users` collection
3. Find your user → click Edit → change `role` from `"user"` to `"admin"` → Save
4. Log out and log back in → Admin section appears in the sidebar

---

## API Health Check
Visit http://localhost:5000/api/health — should return `{"status":"ok"}`

---

## Common errors

| Error | Fix |
|-------|-----|
| MongoDB connection failed | Make sure `mongod` is running in Terminal 1 |
| Port 5000 already in use | Kill the process using that port or change PORT in server/.env |
| npm install fails | Make sure you are inside the correct folder (server or client) |
| White screen on frontend | Check browser console for errors, make sure backend is running |
