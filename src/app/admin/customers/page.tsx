"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  Package,
  Calendar,
  Edit,
  MoreVertical
} from "lucide-react"
import { Customer } from "@/types/spa"
import { CustomerStorage, CustomerPackageStorage } from "@/lib/storage"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load customers on component mount
  useEffect(() => {
    loadCustomers()
  }, [])

  // Filter customers when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const filtered = CustomerStorage.search(searchTerm)
      setFilteredCustomers(filtered)
    }
  }, [searchTerm, customers])

  const loadCustomers = () => {
    setIsLoading(true)
    try {
      const allCustomers = CustomerStorage.getAll()
      setCustomers(allCustomers)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCustomerPackageInfo = (customerId: string) => {
    const packages = CustomerPackageStorage.getByCustomerId(customerId)
    const activePackages = packages.filter(pkg => pkg.status === 'active')
    const totalSessions = activePackages.reduce((sum, pkg) => sum + pkg.sessionsRemaining, 0)
    
    return {
      totalPackages: packages.length,
      activePackages: activePackages.length,
      remainingSessions: totalSessions
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
            <p className="text-gray-600">Đang tải danh sách khách hàng...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-600">Quản lý thông tin khách hàng và gói dịch vụ</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/customers/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Link>
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo tên, số điện thoại hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng khách hàng</span>
              <span className="font-semibold">{customers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Kết quả tìm kiếm</span>
              <span className="font-semibold text-green-600">{filteredCustomers.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy khách hàng" : "Chưa có khách hàng nào"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Thử tìm kiếm với từ khóa khác hoặc thêm khách hàng mới" 
                  : "Bắt đầu bằng cách thêm khách hàng đầu tiên"
                }
              </p>
              {!searchTerm && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/admin/customers/new">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm khách hàng đầu tiên
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => {
                const packageInfo = getCustomerPackageInfo(customer.id)
                
                return (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {customer.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                          {customer.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{customer.address}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Package Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Gói đang sử dụng:</span>
                          <Badge variant={packageInfo.activePackages > 0 ? "default" : "secondary"}>
                            {packageInfo.activePackages} gói
                          </Badge>
                        </div>
                        {packageInfo.remainingSessions > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Buổi còn lại:</span>
                            <span className="font-medium text-green-600">
                              {packageInfo.remainingSessions} buổi
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button 
                          asChild
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Xem chi tiết
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Bán gói
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Đặt lịch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}