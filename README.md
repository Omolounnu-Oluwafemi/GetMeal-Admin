# Getameal Admin Dashboard

A modern, production-ready admin dashboard for the Getameal food delivery platform built with Next.js 14, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://via.placeholder.com/1200x600/209d01/ffffff?text=Getameal+Admin+Dashboard)

## 🚀 Features

### ✅ Fully Implemented
- **Dashboard Overview** - Real-time metrics and statistics
- **Interactive Charts** - Order volume and activity tracking with Recharts
- **System Alerts** - Late orders and payment failure monitoring
- **Broadcast System** - Send push notifications to customers/cooks
  - Multiple message types (Promotional, Announcement, Alert)
  - Audience targeting (All, Active, Zone-specific, Cooks)
  - Live preview
  - Auto-fill examples
- **Responsive Sidebar Navigation**
- **Global Search**
- **Modern UI/UX** - 20px border radius, clean white cards

### 📋 Key Design Specifications
- **Primary Color**: `#209d01` (Getameal Green)
- **Background**: `#F9FAFB` (Light Gray)
- **Border Radius**: `20px` for cards, `12px` for inputs
- **Typography**: System fonts with clear hierarchy
- **Icons**: Lucide React (70+ icons)

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React v0.263.1
- **State Management**: React Hooks

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone or extract the project**
```bash
cd getameal-admin
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
getameal-admin/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard page
│   ├── globals.css         # Global styles
│   ├── customers/          # Customers page (placeholder)
│   ├── cooks/              # Cooks page (placeholder)
│   ├── snapshot/           # Snapshot page (placeholder)
│   ├── orders/             # Orders page (placeholder)
│   ├── payments/           # Payments page (placeholder)
│   └── settings/           # Settings page (placeholder)
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Header.tsx          # Top header with search
│   ├── BroadcastModal.tsx  # Broadcast notification modal
│   ├── StatCard.tsx        # Metric cards
│   ├── OrdersChart.tsx     # Bar chart component
│   └── SystemAlerts.tsx    # Alert cards
├── lib/
│   └── icons.ts            # Icon library (70+ icons)
├── public/                 # Static assets
└── [config files]          # TS, Tailwind, Next configs
```

## 🎨 Design System

### Colors
```css
--primary: #209d01        /* Getameal Green */
--background: #F9FAFB     /* Light Gray */
--foreground: #111827     /* Dark Text */
--gray-light: #F3F4F6     /* Borders */
--gray-medium: #6B7280    /* Secondary Text */
--red: #EF4444           /* Errors */
--orange: #F59E0B        /* Warnings */
--blue: #3B82F6          /* Info */
```

### Border Radius
- Cards: `20px`
- Inputs/Buttons: `12px`
- Small elements: `8px`

### Icon Sizes
- XS: `16px` (w-4 h-4)
- SM: `18px` 
- MD: `20px` (w-5 h-5)
- LG: `24px` (w-6 h-6)

## 🔧 Key Components

### BroadcastModal
The broadcast modal implements all features from the design conversation:

```typescript
Features:
✅ Message Type Selection (Promotional, Announcement, Alert)
✅ Target Audience Dropdown
✅ Zone-specific targeting
✅ Cooks targeting
✅ Estimated reach display
✅ Live preview
✅ Auto-fill examples
✅ Fixed footer buttons
✅ 40px dropdown padding
```

### StatCard
Reusable metric cards with trend indicators:
```typescript
<StatCard
  label="Total Orders Today"
  value="360"
  trend={{ value: 8.2, isPositive: true }}
/>
```

### OrdersChart
Interactive bar chart showing hourly order volume with Recharts.

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar (future enhancement)
- **Mobile**: Bottom navigation (future enhancement)

## 🚦 Build for Production

```bash
npm run build
npm start
```

## 📝 Development Notes

### All Design Updates Implemented:
1. ✅ Target audience changed from buttons to dropdown
2. ✅ Dropdown padding increased to 40px (pr-10)
3. ✅ Cooks option added to audience targeting
4. ✅ Modal footer made fixed/sticky
5. ✅ All icons packaged in single file
6. ✅ 20px border radius on all cards
7. ✅ No icons at top of stat cards (as specified)
8. ✅ Trend indicators at bottom of cards

### Icons Library
All 70+ icons are organized in `/lib/icons.ts` with categories:
- Navigation & Layout
- Action Icons
- User & Profile
- Order & Commerce
- Status & Alerts
- Content & Data
- Security
- Broadcast-specific

## 🎯 Next Steps

To complete the dashboard, implement:

1. **API Integration** - Connect to backend services
2. **Data Fetching** - Real-time data from API
3. **Authentication** - User login and session management
4. **Advanced Filtering** - Date ranges, zone selection
5. **Table Views** - Customer, cook, and order tables
6. **Detail Pages** - Individual order/customer views
7. **Export Features** - CSV/PDF exports
8. **Real-time Updates** - WebSocket for live data

## 📄 License

Private - Getameal Admin Dashboard

## 👥 Support

For questions or issues, contact your development team.

---

**Built with ❤️ for Getameal**
