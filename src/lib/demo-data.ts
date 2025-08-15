// Demo data for spa management system
import { 
  Customer, 
  CustomerPackage, 
  Session, 
  Sale, 
  PaymentMethod 
} from "@/types/spa"
import { 
  CustomerStorage, 
  CustomerPackageStorage, 
  SessionStorage, 
  SalesStorage 
} from "./storage"

// Demo customers
const demoCustomers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Nguyễn Thị Lan",
    phone: "0901234567",
    address: "123 Nguyễn Du, Quận 1, TP.HCM",
    notes: "Thích massage nhẹ nhàng, có vấn đề về vai gáy"
  },
  {
    name: "Trần Văn Minh",
    phone: "0987654321",
    address: "456 Lê Lợi, Quận 3, TP.HCM",
    notes: "Khách hàng VIP, thường đặt lịch vào cuối tuần"
  },
  {
    name: "Lê Thị Hương",
    phone: "0912345678",
    address: "789 Hai Bà Trưng, Quận 1, TP.HCM"
  },
  {
    name: "Phạm Văn Đức",
    phone: "0965432109",
    address: "321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    notes: "Vận động viên, cần massage phục hồi chức năng"
  },
  {
    name: "Hoàng Thị Mai",
    phone: "0934567890",
    address: "654 Cộng Hòa, Quận Tân Bình, TP.HCM"
  },
  {
    name: "Võ Minh Tuấn",
    phone: "0923456789",
    address: "987 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    notes: "Làm việc văn phòng, đau lưng mãn tính"
  },
  {
    name: "Đặng Thị Thu",
    phone: "0956789012",
    address: "147 Trần Hưng Đạo, Quận 1, TP.HCM"
  },
  {
    name: "Bùi Văn Hùng",
    phone: "0945678901",
    address: "258 Pasteur, Quận 3, TP.HCM",
    notes: "Khách hàng thân thiết, đã sử dụng dịch vụ 2 năm"
  }
]

// Helper function to get random date within range
const getRandomDate = (daysBack: number, daysForward: number = 0): Date => {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * (daysBack + daysForward + 1)) - daysBack
  const date = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000)
  return date
}

// Helper function to get random time
const getRandomTime = (): { start: string; end: string } => {
  const times = [
    { start: "08:00", end: "09:30" },
    { start: "09:00", end: "10:30" },
    { start: "10:00", end: "11:30" },
    { start: "11:00", end: "12:30" },
    { start: "13:00", end: "14:30" },
    { start: "14:00", end: "15:30" },
    { start: "15:00", end: "16:30" },
    { start: "16:00", end: "17:30" },
    { start: "17:00", end: "18:30" }
  ]
  return times[Math.floor(Math.random() * times.length)]
}

const therapists = ["Chị Hoa", "Anh Minh", "Chị Lan", "Anh Đức", "Chị Mai"]

export const generateDemoData = (): void => {
  try {
    console.log("Generating demo data...")
    
    // Clear existing data
    localStorage.clear()
    
    // Create demo customers
    const createdCustomers: Customer[] = []
    demoCustomers.forEach(customerData => {
      const result = CustomerStorage.create(customerData)
      if (result.success && result.data) {
        createdCustomers.push(result.data)
      }
    })
    
    console.log(`Created ${createdCustomers.length} demo customers`)
    
    // Create demo packages and sales
    const packageTypes = [
      { id: 'trial', type: 'trial' as const, name: 'Gói Trải Nghiệm', sessions: 1, price: 86000 },
      { id: '10-sessions', type: '10-sessions' as const, name: 'Gói 10 Buổi', sessions: 10, price: 1868000 },
      { id: '30-sessions', type: '30-sessions' as const, name: 'Gói 30 Buổi', sessions: 30, price: 4868000 },
      { id: '100-sessions', type: '100-sessions' as const, name: 'Gói 100 Buổi', sessions: 100, price: 11868000 }
    ]
    
    const paymentMethods: PaymentMethod[] = ['cash', 'card', 'transfer']
    
    createdCustomers.forEach((customer, index) => {
      // Each customer gets 1-3 packages
      const packageCount = Math.floor(Math.random() * 3) + 1
      
      for (let i = 0; i < packageCount; i++) {
        const randomPackage = packageTypes[Math.floor(Math.random() * packageTypes.length)]
        const purchaseDate = getRandomDate(60, 0) // Within last 60 days
        const sessionsUsed = Math.floor(Math.random() * (randomPackage.sessions + 1))
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
        
        // Create customer package
        const packageData: Omit<CustomerPackage, 'id'> = {
          customerId: customer.id,
          packageId: randomPackage.id,
          packageType: randomPackage.type,
          packageName: randomPackage.name,
          purchaseDate,
          totalSessions: randomPackage.sessions,
          sessionsUsed,
          sessionsRemaining: randomPackage.sessions - sessionsUsed,
          paymentMethod,
          amount: randomPackage.price,
          status: sessionsUsed >= randomPackage.sessions ? 'completed' : 'active'
        }
        
        const packageResult = CustomerPackageStorage.create(packageData)
        
        // Create sale record
        if (packageResult.success) {
          const saleData: Omit<Sale, 'id'> = {
            customerId: customer.id,
            customerName: customer.name,
            packageId: randomPackage.id,
            packageType: randomPackage.type,
            packageName: randomPackage.name,
            amount: randomPackage.price,
            paymentMethod,
            saleDate: purchaseDate,
            staffMember: "Demo Staff"
          }
          
          SalesStorage.create(saleData)
          
          // Create sessions for this package
          if (packageResult.data) {
            for (let sessionNum = 1; sessionNum <= sessionsUsed; sessionNum++) {
              const sessionDate = new Date(purchaseDate.getTime() + sessionNum * 7 * 24 * 60 * 60 * 1000) // Weekly sessions
              const timeSlot = getRandomTime()
              const therapist = therapists[Math.floor(Math.random() * therapists.length)]
              
              const sessionData: Omit<Session, 'id'> = {
                customerId: customer.id,
                customerName: customer.name,
                packageId: packageResult.data.id,
                scheduledDate: sessionDate,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                completedDate: sessionDate,
                status: 'completed',
                therapist,
                sessionNumber: sessionNum,
                roomNumber: `${Math.floor(Math.random() * 5) + 1}`,
                notes: sessionNum === 1 ? "Buổi đầu tiên, tìm hiểu nhu cầu khách hàng" : undefined
              }
              
              SessionStorage.create(sessionData)
            }
            
            // Create some future sessions for active packages
            if (packageData.status === 'active' && packageData.sessionsRemaining > 0) {
              const futureSessions = Math.min(3, packageData.sessionsRemaining) // Create up to 3 future sessions
              
              for (let futureNum = 1; futureNum <= futureSessions; futureNum++) {
                const futureDate = getRandomDate(-7, 14) // Between 1 week ago and 2 weeks from now
                const timeSlot = getRandomTime()
                const therapist = therapists[Math.floor(Math.random() * therapists.length)]
                
                const futureSessionData: Omit<Session, 'id'> = {
                  customerId: customer.id,
                  customerName: customer.name,
                  packageId: packageResult.data.id,
                  scheduledDate: futureDate,
                  startTime: timeSlot.start,
                  endTime: timeSlot.end,
                  status: futureDate < new Date() ? 'completed' : 'scheduled',
                  therapist,
                  sessionNumber: sessionsUsed + futureNum,
                  roomNumber: `${Math.floor(Math.random() * 5) + 1}`,
                  completedDate: futureDate < new Date() ? futureDate : undefined
                }
                
                SessionStorage.create(futureSessionData)
              }
            }
          }
        }
      }
    })
    
    console.log("Demo data generation completed!")
    
  } catch (error) {
    console.error("Error generating demo data:", error)
  }
}

export const clearDemoData = (): void => {
  try {
    localStorage.clear()
    console.log("Demo data cleared!")
  } catch (error) {
    console.error("Error clearing demo data:", error)
  }
}