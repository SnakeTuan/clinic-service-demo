"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  MapPin, 
  Calendar,
  Package,
  ShoppingCart,
  User,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Customer, CustomerPackage, Session } from "@/types/spa"
import { CustomerStorage, CustomerPackageStorage, SessionStorage } from "@/lib/storage"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [packages, setPackages] = useState<CustomerPackage[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (customerId) {
      loadCustomerData()
    }
  }, [customerId])

  const loadCustomerData = () => {
    setIsLoading(true)
    try {
      // Load customer info
      const customerData = CustomerStorage.getById(customerId)
      if (!customerData) {
        router.push("/admin/customers")
        return
      }
      setCustomer(customerData)

      // Load customer packages
      const customerPackages = CustomerPackageStorage.getByCustomerId(customerId)
      setPackages(customerPackages)

      // Load customer sessions
      const customerSessions = SessionStorage.getByCustomerId(customerId)
      setSessions(customerSessions)
    } catch (error) {
      console.error("Error loading customer data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPackageStatusColor = (status: CustomerPackage['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'scheduled': return 'text-blue-600'
      case 'in-progress': return 'text-yellow-600'
      case 'cancelled': return 'text-red-600'
      case 'no-show': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getSessionStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
      case 'no-show': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Đang tải...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Không tìm thấy khách hàng</h1>
          </div>
        </div>
      </div>
    )
  }

  const activePackages = packages.filter(pkg => pkg.status === 'active')
  const totalRemainingSessions = activePackages.reduce((sum, pkg) => sum + pkg.sessionsRemaining, 0)
  const recentSessions = sessions.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Thông tin chi tiết khách hàng</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Bán gói mới
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Đặt lịch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{customer.phone}</span>
            </div>
            {customer.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-sm">{customer.address}</span>
              </div>
            )}
            {customer.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</p>
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Khách hàng từ: {customer.createdAt.toLocaleDateString('vi-VN')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng gói đã mua:</span>
              <span className="font-semibold">{packages.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gói đang sử dụng:</span>
              <Badge className="bg-green-100 text-green-800">
                {activePackages.length} gói
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Buổi còn lại:</span>
              <span className="font-semibold text-green-600">
                {totalRemainingSessions} buổi
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng buổi đã làm:</span>
              <span className="font-semibold">
                {sessions.filter(s => s.status === 'completed').length} buổi
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Buổi massage gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Chưa có buổi massage nào
              </p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">
                        {session.scheduledDate.toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {session.startTime} - {session.therapist || 'Chưa phân công'}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getSessionStatusColor(session.status)}`}>
                      {getSessionStatusIcon(session.status)}
                      <span className="text-xs capitalize">
                        {session.status === 'completed' && 'Hoàn thành'}
                        {session.status === 'scheduled' && 'Đã đặt'}
                        {session.status === 'in-progress' && 'Đang thực hiện'}
                        {session.status === 'cancelled' && 'Đã hủy'}
                        {session.status === 'no-show' && 'Không đến'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Gói dịch vụ ({packages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có gói dịch vụ nào
              </h3>
              <p className="text-gray-600 mb-4">
                Khách hàng chưa mua gói dịch vụ nào. Bán gói đầu tiên ngay!
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Bán gói dịch vụ
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{pkg.packageName}</h4>
                        <p className="text-sm text-gray-600">
                          Mua ngày: {pkg.purchaseDate.toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <Badge className={getPackageStatusColor(pkg.status)}>
                        {pkg.status === 'active' && 'Đang sử dụng'}
                        {pkg.status === 'completed' && 'Hoàn thành'}
                        {pkg.status === 'expired' && 'Hết hạn'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng buổi:</span>
                        <span className="font-medium">{pkg.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã sử dụng:</span>
                        <span className="font-medium">{pkg.sessionsUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Còn lại:</span>
                        <span className="font-medium text-green-600">{pkg.sessionsRemaining}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá trị:</span>
                        <span className="font-medium">{pkg.amount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>

                    {pkg.status === 'active' && pkg.sessionsRemaining > 0 && (
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        Đặt lịch massage
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}