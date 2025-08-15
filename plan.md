# Spa Massage Management System - Development Plan

## 🎯 Project Overview
Admin system for spa owners/staff to manage massage therapy packages business.

**Target:** Massage therapy packages from spa menu:
- Trial Package: 86,000 VND/session
- 10 Sessions: 1,868,000 VND total  
- 30 Sessions: 4,868,000 VND total
- 100 Sessions: 11,868,000 VND total

## 🏗️ Technical Stack
- **Framework:** Next.js 14 with App Router + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Storage:** Local Storage (demo purposes)
- **Language:** Vietnamese localization with VND pricing

## 📱 Target Users
- Spa owners
- Reception staff  
- Therapists
- Business managers

## 🚀 Development Phases

### Phase 1: Project Foundation
- [ ] Create Next.js project with TypeScript
- [ ] Setup Tailwind CSS configuration
- [ ] Install and configure shadcn/ui
- [ ] Create basic layout with sidebar navigation
- [ ] Setup Vietnamese fonts and theme colors

### Phase 2: Customer Management
- [ ] Customer data model and types
- [ ] Add new customer form (name, phone, address, notes)
- [ ] Customer list with search functionality
- [ ] Customer profile page with purchase history
- [ ] Edit customer information
- [ ] Local storage utilities for customers

### Phase 3: Package Sales Module
- [ ] Package data model (4 massage package types)
- [ ] Package selection cards with pricing
- [ ] Sales transaction form
- [ ] Payment method tracking (cash, card, transfer)
- [ ] Generate sales receipt/confirmation
- [ ] Sales history tracking

### Phase 4: Treatment Session Management
- [ ] Session booking from customer packages
- [ ] Calendar view for scheduled sessions
- [ ] Mark sessions as completed
- [ ] Track remaining sessions per package
- [ ] Session history and notes
- [ ] Customer session balance display

### Phase 5: Business Analytics Dashboard
- [ ] Daily/monthly sales overview
- [ ] Revenue by package type charts
- [ ] Customer metrics (new, returning, lifetime value)
- [ ] Popular package analysis
- [ ] Session utilization rates
- [ ] Export reports functionality

### Phase 6: Polish & Finalization
- [ ] Complete Vietnamese translation
- [ ] Mobile responsive optimization
- [ ] Error handling and validation
- [ ] Demo data seeding
- [ ] Performance optimization
- [ ] Final testing and bug fixes

## 🎨 UI/UX Features

### Main Navigation
- 📊 **Dashboard** - Overview, today's stats, quick actions
- 👥 **Customers** - Manage customer profiles and history
- 💰 **Sales** - Sell packages, view transactions
- 📅 **Sessions** - Schedule and track treatments
- 📈 **Analytics** - Business reports and insights

### Key User Flows
1. **New Customer Sale:** Add customer → Select package → Process payment → Generate receipt
2. **Session Booking:** Find customer → Select from packages → Schedule appointment
3. **Session Completion:** Find appointment → Mark complete → Update package balance
4. **Daily Operations:** View dashboard → Check appointments → Process walk-ins

## 📊 Data Models

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  packages: CustomerPackage[];
}
```

### Package
```typescript
interface Package {
  id: string;
  type: 'trial' | '10-sessions' | '30-sessions' | '100-sessions';
  name: string;
  sessions: number;
  price: number;
  pricePerSession: number;
}
```

### Customer Package
```typescript
interface CustomerPackage {
  id: string;
  customerId: string;
  packageType: string;
  purchaseDate: Date;
  totalSessions: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  amount: number;
  status: 'active' | 'expired' | 'completed';
}
```

### Session
```typescript
interface Session {
  id: string;
  customerId: string;
  packageId: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  therapist?: string;
}
```

## 🎯 Success Criteria
- [ ] Staff can easily add customers and sell packages
- [ ] Real-time tracking of customer package balances
- [ ] Simple session booking and completion workflow
- [ ] Clear business analytics for owner decision-making
- [ ] Vietnamese interface with VND pricing
- [ ] Works smoothly on tablets for front desk staff

## 📝 Development Notes
- Prioritize ease of use for non-technical spa staff
- Fast customer search is critical for daily operations
- Clear visual indicators for package balances and expiry
- Simple, clean interface that works on mobile devices
- Demo data should reflect realistic Vietnamese spa business

---
**Status:** 🚧 In Development
**Started:** 2025-08-15
**Estimated Completion:** 3-4 days