"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  User,
  Phone,
  MapPin
} from "lucide-react"
import { Session, Customer, CustomerPackage } from "@/types/spa"
import { 
  SessionStorage, 
  CustomerStorage, 
  CustomerPackageStorage 
} from "@/lib/storage"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setIsLoading(true)
    try {
      const allSessions = SessionStorage.getAll()
      const allCustomers = CustomerStorage.getAll()
      
      setSessions(allSessions)
      setCustomers(allCustomers)
    } catch (error) {
      console.error("Error loading sessions data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || "Không tìm thấy"
  }

  const getSessionStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no-show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionStatusText = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'Đã đặt'
      case 'in-progress': return 'Đang thực hiện'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      case 'no-show': return 'Không đến'
      default: return status
    }
  }

  const updateSessionStatus = (sessionId: string, newStatus: Session['status']) => {
    const completedDate = newStatus === 'completed' ? new Date() : undefined
    const result = SessionStorage.updateStatus(sessionId, newStatus, completedDate)
    
    if (result.success) {
      loadData() // Reload data to reflect changes
      
      // If session is completed, update package session count
      if (newStatus === 'completed') {
        const session = sessions.find(s => s.id === sessionId)
        if (session) {
          const customerPackages = CustomerPackageStorage.getByCustomerId(session.customerId)
          const activePackage = customerPackages.find(pkg => 
            pkg.id === session.packageId && pkg.status === 'active'
          )
          
          if (activePackage) {
            CustomerPackageStorage.updateSessionCount(
              activePackage.id, 
              activePackage.sessionsUsed + 1
            )
          }
        }
      }
    } else {
      alert(result.error || "Không thể cập nhật trạng thái")
    }
  }

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === "" || 
      getCustomerName(session.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.therapist && session.therapist.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    
    const matchesDate = session.scheduledDate.toDateString() === selectedDate.toDateString()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Group sessions by time
  const sessionsByTime = filteredSessions.reduce((acc, session) => {
    const timeKey = session.startTime
    if (!acc[timeKey]) {
      acc[timeKey] = []
    }
    acc[timeKey].push(session)
    return acc
  }, {} as Record<string, Session[]>)

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn</h1>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn massage</h1>
          <p className="text-gray-600">Quản lý và theo dõi các buổi massage</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Đặt lịch mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="scheduled">Đã đặt</SelectItem>
                <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="no-show">Không đến</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredSessions.length}
              </p>
              <p className="text-sm text-blue-600">
                Lịch hẹn hôm nay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Lịch hẹn ngày {selectedDate.toLocaleDateString('vi-VN')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có lịch hẹn nào
              </h3>
              <p className="text-gray-600 mb-4">
                Chưa có lịch hẹn nào cho ngày này
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Đặt lịch hẹn đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {timeSlots.map((timeSlot) => {
                const sessionsAtTime = sessionsByTime[timeSlot] || []
                
                return (
                  <div key={timeSlot} className="flex">
                    {/* Time column */}
                    <div className="w-20 flex-shrink-0 py-4 text-sm font-medium text-gray-600">
                      {timeSlot}
                    </div>
                    
                    {/* Sessions column */}
                    <div className="flex-1 space-y-2">
                      {sessionsAtTime.length === 0 ? (
                        <div className="py-4 border-l-2 border-gray-100 pl-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 border-dashed border-2 w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Đặt lịch {timeSlot}
                          </Button>
                        </div>
                      ) : (
                        sessionsAtTime.map((session) => (
                          <Card key={session.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-medium text-gray-900">
                                      {getCustomerName(session.customerId)}
                                    </h4>
                                    <Badge className={getSessionStatusColor(session.status)}>
                                      {getSessionStatusText(session.status)}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {session.startTime} - {session.endTime}
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-3 w-3 mr-1" />
                                      {session.therapist || "Chưa phân công"}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-xs">Buổi {session.sessionNumber}</span>
                                    </div>
                                    {session.roomNumber && (
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Phòng {session.roomNumber}
                                      </div>
                                    )}
                                  </div>

                                  {session.notes && (
                                    <p className="text-sm text-gray-600 mt-2 italic">
                                      {session.notes}
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2 ml-4">
                                  {session.status === 'scheduled' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSessionStatus(session.id, 'in-progress')}
                                      >
                                        Bắt đầu
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => updateSessionStatus(session.id, 'completed')}
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Hoàn thành
                                      </Button>
                                    </>
                                  )}
                                  
                                  {session.status === 'in-progress' && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => updateSessionStatus(session.id, 'completed')}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Hoàn thành
                                    </Button>
                                  )}

                                  {(session.status === 'scheduled' || session.status === 'in-progress') && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                      onClick={() => updateSessionStatus(session.id, 'cancelled')}
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Hủy
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}