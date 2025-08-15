// Core data models for spa management system

export interface Customer {
  id: string
  name: string
  phone: string
  address?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Package {
  id: string
  type: 'trial' | '10-sessions' | '30-sessions' | '100-sessions'
  name: string
  sessions: number
  price: number
  pricePerSession: number
  description?: string
  isActive: boolean
}

export interface CustomerPackage {
  id: string
  customerId: string
  packageId: string
  packageType: Package['type']
  packageName: string
  purchaseDate: Date
  totalSessions: number
  sessionsUsed: number
  sessionsRemaining: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  amount: number
  status: 'active' | 'expired' | 'completed'
  expiryDate?: Date
  notes?: string
}

export interface Session {
  id: string
  customerId: string
  customerName: string
  packageId: string
  scheduledDate: Date
  startTime: string
  endTime: string
  completedDate?: Date
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  therapist?: string
  notes?: string
  roomNumber?: string
  sessionNumber: number // Which session in the package (1, 2, 3, etc.)
}

export interface Sale {
  id: string
  customerId: string
  customerName: string
  packageId: string
  packageType: Package['type']
  packageName: string
  amount: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  saleDate: Date
  staffMember?: string
  notes?: string
}

export interface BusinessMetrics {
  dailySales: number
  monthlySales: number
  dailyCustomers: number
  monthlyCustomers: number
  dailySessions: number
  monthlySessions: number
  totalCustomers: number
  activePackages: number
  completionRate: number
  returnCustomerRate: number
}

// Default package definitions
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'trial',
    type: 'trial',
    name: 'Gói Trải Nghiệm',
    sessions: 1,
    price: 86000,
    pricePerSession: 86000,
    description: 'Trải nghiệm massage thư giãn',
    isActive: true
  },
  {
    id: '10-sessions',
    type: '10-sessions', 
    name: 'Gói 10 Buổi',
    sessions: 10,
    price: 1868000,
    pricePerSession: 186800,
    description: 'Gói massage cơ bản tiết kiệm',
    isActive: true
  },
  {
    id: '30-sessions',
    type: '30-sessions',
    name: 'Gói 30 Buổi', 
    sessions: 30,
    price: 4868000,
    pricePerSession: 162267,
    description: 'Gói massage phổ biến cho chăm sóc đều đặn',
    isActive: true
  },
  {
    id: '100-sessions',
    type: '100-sessions',
    name: 'Gói 100 Buổi',
    sessions: 100, 
    price: 11868000,
    pricePerSession: 118680,
    description: 'Gói massage VIP với giá tốt nhất',
    isActive: true
  }
]

// Utility types
export type PaymentMethod = 'cash' | 'card' | 'transfer'
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
export type PackageStatus = 'active' | 'expired' | 'completed'

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Search and filter types  
export interface CustomerFilter {
  searchTerm?: string
  hasActivePackages?: boolean
  createdAfter?: Date
  createdBefore?: Date
}

export interface SessionFilter {
  date?: Date
  status?: SessionStatus
  therapist?: string
  customerId?: string
}

export interface SalesFilter {
  startDate?: Date
  endDate?: Date
  packageType?: Package['type']
  paymentMethod?: PaymentMethod
  minAmount?: number
  maxAmount?: number
}