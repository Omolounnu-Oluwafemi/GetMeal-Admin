# 🚀 Quick Start Guide - Getameal Admin Dashboard

## Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd getameal-admin
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Recharts (charts)

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:3000**

You should see the dashboard with:
- ✅ Sidebar navigation
- ✅ Header with search and broadcast button
- ✅ 6 metric cards (Active Cooks, Total Orders, etc.)
- ✅ Orders activity chart
- ✅ System alerts panel

## 🎯 Testing the Broadcast Feature

1. Click the green **"Send Broadcast"** button in the top-right
2. The modal should open with:
   - Message type selection (Promotional, Announcement, Alert)
   - Target audience dropdown
   - Zone selection (if applicable)
   - Live preview
   - Auto-filled example messages
3. Click "Send Broadcast" to test the send animation

## 📁 Project Structure Overview

```
getameal-admin/
├── app/                    # Next.js pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard
│   └── [other pages]/     # Other routes
├── components/            # React components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── BroadcastModal.tsx
│   └── [others]
├── lib/
│   └── icons.ts          # All icons library
└── README.md             # Full documentation
```

## 🎨 Key Features Implemented

### ✅ Dashboard Page
- 6 stat cards with trend indicators
- Interactive bar chart (Recharts)
- System alerts with late orders & payment failures
- Responsive grid layout

### ✅ Broadcast Modal
- Dropdown for target audience (as per design updates)
- 40px right padding on dropdowns
- Cooks targeting option
- Fixed footer buttons
- Live preview
- Auto-fill examples

### ✅ Design System
- Primary color: `#209d01` (Green)
- 20px border radius on cards
- Clean, modern UI
- All icons from Lucide React

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 📝 Next Steps for Your Dev Team

1. **API Integration**
   - Connect to your backend API
   - Replace mock data with real data

2. **Authentication**
   - Add login page
   - Implement session management
   - Protect routes

3. **Complete Other Pages**
   - Customers table
   - Cooks management
   - Orders list
   - Payments history

4. **Advanced Features**
   - Real-time updates (WebSocket)
   - Advanced filtering
   - Export functionality
   - Notifications system

## 📚 Documentation

- **README.md** - Full project documentation
- **ICONS_DOCUMENTATION.md** - Complete icons guide
- **package.json** - Dependencies list

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📧 Support

For questions about the implementation:
1. Check README.md for detailed docs
2. Check ICONS_DOCUMENTATION.md for icon usage
3. Contact your project lead

---

**You're all set! 🎉**

The dashboard is ready for development. Start the dev server and begin building!
