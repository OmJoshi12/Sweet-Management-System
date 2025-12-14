# ⚡ SweetVerse - Quick Reference

## 🚀 Start Servers (2 terminals)

### Terminal 1: Backend
```bash
cd "Sweet Management System\backend"
npm start
# http://localhost:4000
```

### Terminal 2: Frontend  
```bash
cd "Sweet Management System\frontend"
npm start
# http://localhost:3000
```

---

## 🔐 Login Credentials

**Admin Account**
```
Email:    admin@example.com
Password: admin123
```

**Regular User**
- Register new at http://localhost:3000/register

---

## 📍 URL Map

| Feature | URL | Role |
|---------|-----|------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | User+ |
| Add Sweet | `/add` | Admin |
| Edit Sweet | `/edit/:id` | Admin |

---

## 🎨 UI Features

### Dark Theme
- Background: `#0a0a14` (darker) → `#1a1a2e`
- Glass morphism with backdrop blur
- Neon accents (purple, pink, cyan)
- Smooth animations & transitions

### Components
- **SweetCard**: Image, price, stock bar, action buttons
- **Sidebar**: Navigation, user info, logout (desktop)
- **MobileNav**: Hamburger menu (mobile)
- **Stats Grid**: Total sweets, value, out of stock

### Colors
- Primary: Purple `#a78bfa`
- Secondary: Pink `#ec4899`
- Accent: Cyan `#06b6d4`

---

## 📊 Dashboard Features

### Search & Filter
- **Search**: By sweet name (real-time)
- **Category**: Dropdown filter
- **Sort**: Name, Price, Stock
- **Stats**: Display counts

### Sweet Card Actions
**All Users:**
- Buy (with quantity prompt)

**Admin Only:**
- Edit (opens form)
- Restock (add quantity)
- Delete (with confirmation)

---

## 🗄️ Database

### Default Sweets (Auto-loaded)
1. Chocolate Bar - $2.50, qty: 20
2. Gummy Bears - $1.50, qty: 30
3. Lollipop - $0.75, qty: 50

### Collections
- **users**: Email, password, role
- **sweets**: Name, category, price, quantity, image, timestamps

---

## 🔄 CRUD Operations

### Create
```
Admin clicks "+ Add Sweet"
→ Fill form (name, category, price, qty)
→ Auto-image fetch based on category
→ Save to MongoDB
→ Redirects to dashboard
```

### Read
```
GET /api/sweets              → All sweets
GET /api/sweets/:id          → Single sweet
GET /api/sweets?name=Choco   → Search
```

### Update
```
Admin clicks "Edit" on card
→ Form pre-fills
→ Modify fields
→ Submit
→ MongoDB updated
→ UI updates immediately
```

### Delete
```
Admin clicks "Delete" on card
→ Confirmation dialog
→ Confirm delete
→ MongoDB: Record removed
→ Card disappears from UI
```

---

## 🖼️ Image System

### Auto-Fetch Strategy
1. **Google Custom Search** (if API key available)
2. **Category Defaults** (Unsplash pre-mapped)
3. **Fallback** (Generic sweet image)
4. **Emoji** (UI fallback if image fails)

### Category Emojis
```
🍫 Chocolate    🍬 Candy      🍬 Gummy
🍭 Lollipop     🍩 Donut      🎂 Cake
🍪 Cookie       🍦 Icecream   🍮 Caramel
🍫 Fudge
```

---

## 🔑 API Endpoints

### Auth
```
POST /api/auth/register   (email, password)
POST /api/auth/login      (email, password)
```

### Sweets
```
GET    /api/sweets                (public)
GET    /api/sweets/:id            (public)
POST   /api/sweets                (admin)
PUT    /api/sweets/:id            (admin)
DELETE /api/sweets/:id            (admin)
POST   /api/sweets/:id/purchase   (all auth users)
POST   /api/sweets/:id/restock    (admin)
```

---

## 💾 File Structure (New Files)

### Frontend Components
```
src/components/
├── Logo.jsx              (Brand logo)
├── Sidebar.jsx           (Desktop nav)
├── MobileNav.jsx         (Mobile menu)
├── SweetCard.jsx         (Card component)
└── ProtectedRoute.js     (Auth wrapper)
```

### Frontend Pages
```
src/pages/
├── LoginV2.jsx           (Dark theme login)
├── RegisterV2.jsx        (Register form)
├── DashboardV2.jsx       (Main dashboard)
├── AddSweetV2.jsx        (Create form)
└── EditSweetV2.jsx       (Edit form)
```

### Frontend Files
```
src/
├── App.jsx               (Main routing)
├── api.js                (API client)
└── index.css             (Dark theme styles)
```

### Backend Services
```
src/services/
└── imageService.js       (Image fetching)
```

---

## 🎯 Admin Dashboard Tasks

**View Sweet**
```
Dashboard → Card appears → Shows name, price, image, stock
```

**Add Sweet**
```
Click "+ Add Sweet" → Fill form → Submit → Appears in dashboard
```

**Edit Sweet**
```
Card "Edit" button → Form opens → Modify → Submit → Updates in DB
```

**Delete Sweet**
```
Card "Delete" button → Confirm → Removed from DB & UI
```

**Restock**
```
Card "Restock" button → Enter quantity → Added to stock
```

---

## 🧪 Quick Tests

1. **Test Login**
   - Go to /login
   - Enter admin@example.com / admin123
   - Should redirect to dashboard

2. **Test Dashboard**
   - See 3 default sweets
   - Search works
   - Category filter works
   - Sort options work

3. **Test Admin (Create)**
   - Click "+ Add Sweet"
   - Fill form
   - Submit
   - New card appears

4. **Test Admin (Edit)**
   - Click Edit on card
   - Change any field
   - Submit
   - Card updates

5. **Test Admin (Delete)**
   - Click Delete on card
   - Confirm
   - Card disappears

6. **Test Purchase**
   - Click Buy on card
   - Enter quantity
   - Stock decreases

---

## 🔧 Common Commands

```bash
# Backend
cd backend
npm install              # First time
npm start               # Run server
npm test                # Run tests

# Frontend
cd frontend
npm install              # First time
npm start               # Run server
npm run build           # Production build
npm run eject           # Eject CRA (not recommended)

# MongoDB (if local)
mongod                  # Start MongoDB
mongo                   # Connect to shell
```

---

## 🆘 Quick Fixes

**Backend won't start**
```bash
# Check if port 4000 is in use
lsof -i :4000
# Kill process
kill -9 <PID>
```

**Frontend won't load**
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear cache
rm -rf node_modules package-lock.json
npm install
npm start
```

**API errors**
```bash
# Check backend is running
curl http://localhost:4000/api/sweets

# Check token in localStorage
open DevTools → Application → localStorage
```

**Admin not working**
```bash
# Recreate admin account
cd backend
node reset-admin.js
# Login with admin@example.com / admin123
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (Hamburger menu)
- **Tablet**: 640-1024px (2-column grid)
- **Desktop**: > 1024px (Sidebar + 3-4 columns)

---

## 🎨 Theme Customization

### Colors in index.css
```css
:root {
  --primary: #a78bfa;        /* Purple */
  --secondary: #ec4899;      /* Pink */
  --accent: #06b6d4;         /* Cyan */
  --dark: #0f0f1e;
  --darker: #0a0a14;
}
```

### Custom Classes
```css
.glass           /* Light glass effect */
.glass-dark      /* Dark glass */
.btn-primary     /* Primary button */
.btn-secondary   /* Secondary button */
.neon-pink       /* Pink neon text */
.glow-purple     /* Purple glow */
```

---

## 🌟 Key Features at a Glance

✨ **Dark Theme**: Premium black background with purple/pink accents
🎨 **Glassmorphism**: Frosted glass cards with backdrop blur  
🌈 **Neon Glow**: Glowing text and elements
📱 **Responsive**: Works on all devices
🔐 **Secure**: JWT auth + role-based access
⚡ **Fast**: Real-time updates, optimized queries
🖼️ **Images**: Auto-fetched high-quality images
🗄️ **MongoDB**: Persistent storage
👑 **Admin Panel**: Complete CRUD controls

---

**Happy Exploring! 🍬✨**
