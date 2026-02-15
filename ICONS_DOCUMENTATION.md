# 🎨 Getameal Admin - Icons Documentation

Complete icon library and implementation guide for the Getameal Admin Dashboard.

---

## 📦 Installation

All icons come from the **lucide-react** package (v0.263.1).

```bash
npm install lucide-react@0.263.1
# or
yarn add lucide-react@0.263.1
```

---

## 📂 Icon Library File

We've created a centralized icon library file: `/lib/icons.ts`

This file exports all 70+ icons used throughout the application, organized into logical categories.

### Usage

```typescript
// Import specific icons
import { Users, ChefHat, Send, Search } from '@/lib/icons';

// Import the icon type for TypeScript
import { type LucideIcon } from '@/lib/icons';

// Use in component
function MyComponent() {
  return <Users className="w-5 h-5 text-gray-600" />;
}
```

---

## 🗂️ Icon Categories

### 1️⃣ Navigation & Layout (8 icons)

Used in: Sidebar, navigation, page headers

```typescript
import {
  LayoutDashboard,  // Dashboard page
  Users,            // Customers page
  ChefHat,          // Cooks page
  Clock,            // Snapshot page
  Package,          // Orders page
  CreditCard,       // Payments page
  Settings,         // Settings page
  ArrowLeft,        // Back button
} from '@/lib/icons';
```

**Example:**
```tsx
<Link href="/dashboard">
  <LayoutDashboard className="w-6 h-6 text-primary" />
  <span>Dashboard</span>
</Link>
```

---

### 2️⃣ Action Icons (20 icons)

Used in: Buttons, toolbars, menus

```typescript
import {
  Search,           // Search functionality
  Send,             // Send broadcast button
  Plus,             // Add new items
  Edit,             // Edit actions
  Trash2,           // Delete actions
  Download,         // Download/export
  Upload,           // Upload files
  Save,             // Save changes
  X,                // Close modals/dialogs
  Check,            // Confirm actions
  Copy,             // Copy to clipboard
  Filter,           // Filter data
  RefreshCw,        // Refresh/reload
  MoreVertical,     // More options menu
  MoreHorizontal,   // Horizontal menu
  ChevronDown,      // Dropdown indicator
  ChevronUp,        // Collapse indicator
  ChevronLeft,      // Previous/back
  ChevronRight,     // Next/forward
  ExternalLink,     // Open in new tab
} from '@/lib/icons';
```

**Example:**
```tsx
<button className="btn-primary">
  <Send className="w-5 h-5" />
  Send Broadcast
</button>
```

---

### 3️⃣ User & Profile Icons (11 icons)

Used in: User management, profiles, contacts

```typescript
import {
  User,             // Single user
  UserCheck,        // Verified user
  UserPlus,         // Add user
  UserMinus,        // Remove user
  UserX,            // Blocked user
  Mail,             // Email
  Phone,            // Phone contact
  MapPin,           // Location/address
  Globe,            // Website/global
  Building,         // Organization
  Shield,           // Admin/security
} from '@/lib/icons';
```

**Example:**
```tsx
<div className="user-card">
  <UserCheck className="w-4 h-4 text-green-500" />
  <span>Verified User</span>
</div>
```

---

### 4️⃣ Order & Commerce Icons (10 icons)

Used in: Orders, payments, statistics

```typescript
import {
  ShoppingBag,      // Orders/shopping
  ShoppingCart,     // Cart
  TrendingUp,       // Positive trend
  TrendingDown,     // Negative trend
  DollarSign,       // Currency/money
  Wallet,           // Wallet/payments
  Receipt,          // Receipts
  Tag,              // Price tags
  Percent,          // Discounts/percentages
  BarChart3,        // Statistics/charts
} from '@/lib/icons';
```

**Example:**
```tsx
<div className="trend-indicator">
  <TrendingUp className="w-4 h-4 text-green-500" />
  <span>+12.5%</span>
</div>
```

---

### 5️⃣ Status & Alerts Icons (4 icons)

Used in: Alerts, notifications, status indicators

```typescript
import {
  AlertTriangle,    // Warning/alert
  AlertCircle,      // Information alert
  CheckCircle,      // Success
  XCircle,          // Error/failure
} from '@/lib/icons';
```

**Example:**
```tsx
<div className="alert-error">
  <AlertTriangle className="w-5 h-5 text-red-500" />
  <span>Payment Failed</span>
</div>
```

---

### 6️⃣ Content & Data Icons (4 icons)

Used in: Documents, dates, media

```typescript
import {
  FileText,         // Documents
  Image,            // Images
  Calendar,         // Date picker
  Clock as ClockIcon, // Time (aliased to avoid conflict)
} from '@/lib/icons';
```

**Example:**
```tsx
<button>
  <Calendar className="w-4 h-4" />
  Select Date
</button>
```

---

### 7️⃣ Security Icons (4 icons)

Used in: Authentication, permissions

```typescript
import {
  Lock,             // Locked/secure
  Unlock,           // Unlocked
  Key,              // Access key
  Eye,              // View/visibility
} from '@/lib/icons';
```

**Example:**
```tsx
<div className="password-field">
  <Lock className="w-4 h-4 text-gray-400" />
  <input type="password" />
</div>
```

---

### 8️⃣ Broadcast Modal Specific (3 icons)

Used in: Broadcast modal, notifications

```typescript
import {
  Megaphone,        // Broadcast/announcement
  Bell,             // Notifications
  MessageSquare,    // Messages
} from '@/lib/icons';
```

**Example:**
```tsx
<div className="broadcast-header">
  <Megaphone className="w-6 h-6 text-primary" />
  <h2>Send Broadcast</h2>
</div>
```

---

## 📏 Icon Sizes

Standardized sizes used throughout the app:

| Size | Pixels | Tailwind Class | Usage |
|------|--------|----------------|-------|
| **XS** | 16px | `w-4 h-4` | Small buttons, inline icons |
| **SM** | 18px | `w-[18px] h-[18px]` | Form inputs, labels |
| **MD** | 20px | `w-5 h-5` | Default buttons, navigation |
| **LG** | 24px | `w-6 h-6` | Page headers, large buttons |

### Size Examples:

```tsx
{/* Extra Small - 16px */}
<Check className="w-4 h-4" />

{/* Small - 18px */}
<Search className="w-[18px] h-[18px]" />

{/* Medium - 20px */}
<Send className="w-5 h-5" />

{/* Large - 24px */}
<LayoutDashboard className="w-6 h-6" />
```

---

## 🎨 Color Scheme

Icons should use these theme colors:

```css
/* Primary Colors */
--primary: #209d01        /* Green - Primary actions */
--foreground: #111827     /* Dark - Default icons */

/* Gray Scale */
--gray-dark: #374151      /* Dark gray - Active states */
--gray-medium: #6B7280    /* Medium gray - Secondary icons */
--gray-light: #9CA3AF     /* Light gray - Disabled states */

/* Status Colors */
--success: #10B981        /* Green - Success states */
--error: #EF4444          /* Red - Errors, negative trends */
--warning: #F59E0B        /* Orange - Warnings */
--info: #3B82F6           /* Blue - Information */
```

### Color Examples:

```tsx
{/* Primary action */}
<Send className="w-5 h-5 text-[#209d01]" />

{/* Secondary/inactive */}
<Users className="w-5 h-5 text-[#6B7280]" />

{/* Success indicator */}
<TrendingUp className="w-4 h-4 text-[#10B981]" />

{/* Error indicator */}
<AlertTriangle className="w-5 h-5 text-[#EF4444]" />
```

---

## 🔧 Common Patterns

### User Action Icons

```tsx
// Add User
<button>
  <UserPlus className="w-5 h-5" />
  Add Customer
</button>

// Edit User
<button>
  <Edit className="w-4 h-4" />
</button>

// Delete User
<button>
  <Trash2 className="w-4 h-4 text-red-500" />
</button>
```

### Order Actions

```tsx
// View Order
<button>
  <ShoppingBag className="w-5 h-5" />
  View Order
</button>

// Download Receipt
<button>
  <Download className="w-4 h-4" />
  <Receipt className="w-4 h-4" />
</button>
```

### Status Indicators

```tsx
// Success
<CheckCircle className="w-5 h-5 text-green-500" />

// Warning
<AlertTriangle className="w-5 h-5 text-orange-500" />

// Error
<XCircle className="w-5 h-5 text-red-500" />

// Info
<AlertCircle className="w-5 h-5 text-blue-500" />
```

### Navigation

```tsx
// Sidebar Navigation
<nav>
  <LayoutDashboard className="w-6 h-6" />
  <Users className="w-6 h-6" />
  <Package className="w-6 h-6" />
</nav>

// Breadcrumbs
<div className="breadcrumbs">
  <ArrowLeft className="w-4 h-4" />
  <ChevronRight className="w-4 h-4" />
</div>
```

---

## 💡 TypeScript Support

For TypeScript projects, use the `LucideIcon` type:

```typescript
import { type LucideIcon } from '@/lib/icons';

interface ButtonProps {
  icon: LucideIcon;
  label: string;
}

function IconButton({ icon: Icon, label }: ButtonProps) {
  return (
    <button>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

// Usage
<IconButton icon={Send} label="Send Broadcast" />
```

---

## ♿ Accessibility

Always provide accessible labels for icons:

```tsx
{/* Icon-only button - BAD */}
<button>
  <X className="w-5 h-5" />
</button>

{/* Icon-only button - GOOD */}
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

{/* Icon with text - GOOD */}
<button>
  <Send className="w-5 h-5" />
  <span>Send Broadcast</span>
</button>

{/* Decorative icon - GOOD */}
<div>
  <TrendingUp className="w-4 h-4" aria-hidden="true" />
  <span>+12.5% vs yesterday</span>
</div>
```

---

## 📋 Complete icons.ts File

Here's the complete icon library file to copy into your project:

```typescript
/**
 * Getameal Admin - Complete Icons Library
 * All icons used throughout the admin dashboard
 * Source: lucide-react v0.263.1
 */

// Navigation & Layout Icons (8)
export {
  LayoutDashboard,
  Users,
  ChefHat,
  Clock,
  Package,
  CreditCard,
  Settings,
  ArrowLeft,
} from 'lucide-react';

// Action Icons (20)
export {
  Search,
  Send,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Check,
  Copy,
  Filter,
  RefreshCw,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// User & Profile Icons (11)
export {
  User,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building,
  Shield,
} from 'lucide-react';

// Order & Commerce Icons (10)
export {
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Receipt,
  Tag,
  Percent,
  BarChart3,
} from 'lucide-react';

// Status & Alerts Icons (4)
export {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Content & Data Icons (4)
export {
  FileText,
  Image,
  Calendar,
  Clock as ClockIcon,
} from 'lucide-react';

// Security Icons (4)
export {
  Lock,
  Unlock,
  Key,
  Eye,
} from 'lucide-react';

// Broadcast Modal Specific Icons (3)
export {
  Megaphone,
  Bell,
  MessageSquare,
} from 'lucide-react';

// Type export for TypeScript support
export type { LucideIcon } from 'lucide-react';
```

---

## ✅ Dev Team Checklist

- [ ] Install `lucide-react@0.263.1` package
- [ ] Copy `/lib/icons.ts` file to your project
- [ ] Import icons from `@/lib/icons` (not directly from lucide-react)
- [ ] Use standardized icon sizes (16px, 18px, 20px, 24px)
- [ ] Apply theme colors consistently
- [ ] Add accessibility labels to icon-only buttons
- [ ] Use TypeScript `LucideIcon` type for icon props
- [ ] Follow the common patterns documented above

---

**Questions?** Contact your development lead for clarification.

**Built with ❤️ for Getameal**
