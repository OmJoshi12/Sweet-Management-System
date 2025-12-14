# 🚀 Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Prerequisites
- Node.js v14+ 
- MongoDB running locally
- Git (optional)

---

## 🎯 Step 1: Start Backend

```bash
cd backend
npm install  # Only needed first time
npm start    # Starts on http://localhost:4000
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:4000
```

---

## 🎨 Step 2: Start Frontend

In a NEW terminal window:

```bash
cd frontend
npm install  # Only needed first time
npm start    # Starts on http://localhost:3000
```

Your browser will automatically open to `http://localhost:3000`

---

## 🔐 Step 3: Test the System

### Create a New Account
1. Click **Register** button
2. Enter email: `test@example.com`
3. Enter password: `Test@123`
4. Click **Register**

### Login
1. Click **Login** button
2. Enter same credentials
3. Click **Login**

### View Sweets
- You'll see the dashboard with available sweets
- Click on any sweet to view details
- Click **Buy** button to purchase

### Admin Features (Optional)
To test admin features, use these credentials:
- Email: `admin@example.com`
- Password: `Admin@123`

**Note**: Admin account must be created manually via MongoDB for now.

---

## 📱 Feature Summary

### User Can:
✅ Register & Login
✅ View all sweets
✅ Search sweets by name
✅ Filter by category
✅ View sweet details
✅ Purchase sweets
✅ See stock levels

### Admin Can:
✅ All user features +
✅ Create new sweets
✅ Edit sweet details
✅ Delete sweets
✅ Restock inventory

---

## 🎨 UI Features

- **Modern 3D Design**: Glassmorphic cards with beautiful gradients
- **Responsive**: Works on mobile, tablet, desktop
- **Smooth Animations**: Hover effects, transitions, loading states
- **Color Coded**: Stock levels, actions, status indicators
- **Real-time**: Instant updates after actions

---

## 🐛 Troubleshooting

### Frontend won't load
- Check if `http://localhost:3000` is accessible
- Clear browser cache and refresh
- Check browser console for errors

### Backend connection error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Backend should show "✅ MongoDB connected" message

### Sweets not showing
- Backend must be running first
- Check Network tab in browser DevTools
- Verify API base URL in `frontend/.env`

### Image not displaying
- Google Custom Search credentials optional
- System falls back to Unsplash automatically
- Check `.env` for `GOOGLE_API_KEY`

---

## 🔄 Restart Everything

### Windows
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Start backend
cd backend && node src/server.js

# Start frontend (in new terminal)
cd frontend && npm start
```

### Mac/Linux
```bash
# Kill all Node processes
killall node

# Start backend
cd backend && node src/server.js

# Start frontend (in new terminal)
cd frontend && npm start
```

---

## 📖 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/sweets` | ❌ | List all sweets |
| GET | `/api/sweets/:id` | ❌ | Get sweet details |
| POST | `/api/sweets` | ✅ Admin | Create sweet |
| PUT | `/api/sweets/:id` | ✅ Admin | Update sweet |
| DELETE | `/api/sweets/:id` | ✅ Admin | Delete sweet |
| POST | `/api/sweets/:id/purchase` | ✅ User | Purchase sweet |
| POST | `/api/sweets/:id/restock` | ✅ Admin | Restock sweet |

---

## 🎉 You're All Set!

The system is fully functional with:
- ✨ Beautiful 3D UI theme
- 🔐 Secure authentication
- 📊 Complete CRUD operations
- 📱 Responsive design
- 🚀 Ready for production

**Happy testing!** 🍬
