// localStorage utilities for spa management system
import { 
  Customer, 
  CustomerPackage, 
  Session, 
  Sale, 
  Package, 
  DEFAULT_PACKAGES,
  ApiResponse 
} from '@/types/spa'

// Storage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'spa_customers',
  CUSTOMER_PACKAGES: 'spa_customer_packages', 
  SESSIONS: 'spa_sessions',
  SALES: 'spa_sales',
  PACKAGES: 'spa_packages',
  SETTINGS: 'spa_settings'
} as const

// Generic storage utilities
class StorageManager {
  private static isClient = typeof window !== 'undefined'

  static get<T>(key: string): T[] {
    if (!this.isClient) return []
    
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error)
      return []
    }
  }

  static set<T>(key: string, data: T[]): boolean {
    if (!this.isClient) return false

    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error)
      return false
    }
  }

  static clear(key: string): boolean {
    if (!this.isClient) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error clearing localStorage key ${key}:`, error)
      return false
    }
  }

  static clearAll(): boolean {
    if (!this.isClient) return false

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing all spa data:', error)
      return false
    }
  }
}

// Customer management
export class CustomerStorage {
  static getAll(): Customer[] {
    return StorageManager.get<Customer>(STORAGE_KEYS.CUSTOMERS)
      .map(customer => ({
        ...customer,
        createdAt: new Date(customer.createdAt),
        updatedAt: new Date(customer.updatedAt)
      }))
  }

  static getById(id: string): Customer | null {
    const customers = this.getAll()
    return customers.find(customer => customer.id === id) || null
  }

  static create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): ApiResponse<Customer> {
    try {
      const customers = this.getAll()
      const newCustomer: Customer = {
        ...customerData,
        id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      customers.push(newCustomer)
      const success = StorageManager.set(STORAGE_KEYS.CUSTOMERS, customers)
      
      return success 
        ? { success: true, data: newCustomer, message: 'Khách hàng đã được tạo thành công' }
        : { success: false, error: 'Không thể lưu khách hàng' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi tạo khách hàng' }
    }
  }

  static update(id: string, updateData: Partial<Omit<Customer, 'id' | 'createdAt'>>): ApiResponse<Customer> {
    try {
      const customers = this.getAll()
      const index = customers.findIndex(customer => customer.id === id)
      
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy khách hàng' }
      }

      customers[index] = {
        ...customers[index],
        ...updateData,
        updatedAt: new Date()
      }

      const success = StorageManager.set(STORAGE_KEYS.CUSTOMERS, customers)
      
      return success
        ? { success: true, data: customers[index], message: 'Thông tin khách hàng đã được cập nhật' }
        : { success: false, error: 'Không thể cập nhật khách hàng' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi cập nhật khách hàng' }
    }
  }

  static delete(id: string): ApiResponse<boolean> {
    try {
      const customers = this.getAll()
      const filteredCustomers = customers.filter(customer => customer.id !== id)
      
      if (customers.length === filteredCustomers.length) {
        return { success: false, error: 'Không tìm thấy khách hàng' }
      }

      const success = StorageManager.set(STORAGE_KEYS.CUSTOMERS, filteredCustomers)
      
      return success
        ? { success: true, data: true, message: 'Khách hàng đã được xóa' }
        : { success: false, error: 'Không thể xóa khách hàng' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi xóa khách hàng' }
    }
  }

  static search(searchTerm: string): Customer[] {
    const customers = this.getAll()
    const term = searchTerm.toLowerCase()
    
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(term) ||
      (customer.address && customer.address.toLowerCase().includes(term))
    )
  }
}

// Package management  
export class PackageStorage {
  static getAll(): Package[] {
    const packages = StorageManager.get<Package>(STORAGE_KEYS.PACKAGES)
    return packages.length > 0 ? packages : this.initializeDefaultPackages()
  }

  private static initializeDefaultPackages(): Package[] {
    StorageManager.set(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES)
    return DEFAULT_PACKAGES
  }

  static getById(id: string): Package | null {
    const packages = this.getAll()
    return packages.find(pkg => pkg.id === id) || null
  }

  static getActivePackages(): Package[] {
    return this.getAll().filter(pkg => pkg.isActive)
  }
}

// Customer packages management
export class CustomerPackageStorage {
  static getAll(): CustomerPackage[] {
    return StorageManager.get<CustomerPackage>(STORAGE_KEYS.CUSTOMER_PACKAGES)
      .map(pkg => ({
        ...pkg,
        purchaseDate: new Date(pkg.purchaseDate),
        expiryDate: pkg.expiryDate ? new Date(pkg.expiryDate) : undefined
      }))
  }

  static getByCustomerId(customerId: string): CustomerPackage[] {
    return this.getAll().filter(pkg => pkg.customerId === customerId)
  }

  static getActiveByCustomerId(customerId: string): CustomerPackage[] {
    return this.getByCustomerId(customerId).filter(pkg => 
      pkg.status === 'active' && pkg.sessionsRemaining > 0
    )
  }

  static create(packageData: Omit<CustomerPackage, 'id'>): ApiResponse<CustomerPackage> {
    try {
      const packages = this.getAll()
      const newPackage: CustomerPackage = {
        ...packageData,
        id: `package_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      packages.push(newPackage)
      const success = StorageManager.set(STORAGE_KEYS.CUSTOMER_PACKAGES, packages)
      
      return success
        ? { success: true, data: newPackage, message: 'Gói đã được mua thành công' }
        : { success: false, error: 'Không thể lưu gói khách hàng' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi tạo gói khách hàng' }
    }
  }

  static updateSessionCount(packageId: string, sessionsUsed: number): ApiResponse<CustomerPackage> {
    try {
      const packages = this.getAll()
      const index = packages.findIndex(pkg => pkg.id === packageId)
      
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy gói' }
      }

      packages[index].sessionsUsed = sessionsUsed
      packages[index].sessionsRemaining = packages[index].totalSessions - sessionsUsed
      
      if (packages[index].sessionsRemaining <= 0) {
        packages[index].status = 'completed'
      }

      const success = StorageManager.set(STORAGE_KEYS.CUSTOMER_PACKAGES, packages)
      
      return success
        ? { success: true, data: packages[index], message: 'Số buổi đã được cập nhật' }
        : { success: false, error: 'Không thể cập nhật số buổi' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi cập nhật số buổi' }
    }
  }
}

// Session management
export class SessionStorage {
  static getAll(): Session[] {
    return StorageManager.get<Session>(STORAGE_KEYS.SESSIONS)
      .map(session => ({
        ...session,
        scheduledDate: new Date(session.scheduledDate),
        completedDate: session.completedDate ? new Date(session.completedDate) : undefined
      }))
  }

  static getByDate(date: Date): Session[] {
    const sessions = this.getAll()
    const targetDate = date.toDateString()
    
    return sessions.filter(session => 
      session.scheduledDate.toDateString() === targetDate
    )
  }

  static getByCustomerId(customerId: string): Session[] {
    return this.getAll().filter(session => session.customerId === customerId)
  }

  static create(sessionData: Omit<Session, 'id'>): ApiResponse<Session> {
    try {
      const sessions = this.getAll()
      const newSession: Session = {
        ...sessionData,
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      sessions.push(newSession)
      const success = StorageManager.set(STORAGE_KEYS.SESSIONS, sessions)
      
      return success
        ? { success: true, data: newSession, message: 'Lịch hẹn đã được tạo thành công' }
        : { success: false, error: 'Không thể tạo lịch hẹn' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi tạo lịch hẹn' }
    }
  }

  static updateStatus(sessionId: string, status: Session['status'], completedDate?: Date): ApiResponse<Session> {
    try {
      const sessions = this.getAll()
      const index = sessions.findIndex(session => session.id === sessionId)
      
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy lịch hẹn' }
      }

      sessions[index].status = status
      if (completedDate) {
        sessions[index].completedDate = completedDate
      }

      const success = StorageManager.set(STORAGE_KEYS.SESSIONS, sessions)
      
      return success
        ? { success: true, data: sessions[index], message: 'Trạng thái lịch hẹn đã được cập nhật' }
        : { success: false, error: 'Không thể cập nhật trạng thái' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi cập nhật trạng thái' }
    }
  }
}

// Sales management
export class SalesStorage {
  static getAll(): Sale[] {
    return StorageManager.get<Sale>(STORAGE_KEYS.SALES)
      .map(sale => ({
        ...sale,
        saleDate: new Date(sale.saleDate)
      }))
  }

  static getByDateRange(startDate: Date, endDate: Date): Sale[] {
    const sales = this.getAll()
    
    return sales.filter(sale => 
      sale.saleDate >= startDate && sale.saleDate <= endDate
    )
  }

  static create(saleData: Omit<Sale, 'id'>): ApiResponse<Sale> {
    try {
      const sales = this.getAll()
      const newSale: Sale = {
        ...saleData,
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      sales.push(newSale)
      const success = StorageManager.set(STORAGE_KEYS.SALES, sales)
      
      return success
        ? { success: true, data: newSale, message: 'Giao dịch đã được ghi nhận' }
        : { success: false, error: 'Không thể lưu giao dịch' }
    } catch (error) {
      return { success: false, error: 'Lỗi khi tạo giao dịch' }
    }
  }

  static getTodaySales(): Sale[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return this.getByDateRange(today, tomorrow)
  }

  static getMonthSales(month?: number, year?: number): Sale[] {
    const now = new Date()
    const targetMonth = month ?? now.getMonth()
    const targetYear = year ?? now.getFullYear()
    
    const startDate = new Date(targetYear, targetMonth, 1)
    const endDate = new Date(targetYear, targetMonth + 1, 0)
    
    return this.getByDateRange(startDate, endDate)
  }
}

// Clear all data utility
export const clearAllSpaData = (): boolean => {
  return StorageManager.clearAll()
}