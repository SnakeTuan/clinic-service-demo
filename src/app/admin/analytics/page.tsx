"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Eye
} from "lucide-react"
import { Sale, CustomerPackage, Session, Customer } from "@/types/spa"
import { 
  SalesStorage, 
  CustomerPackageStorage, 
  SessionStorage, 
  CustomerStorage,
  PackageStorage 
} from "@/lib/storage"

export default function AnalyticsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [packages, setPackages] = useState<CustomerPackage[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    setIsLoading(true)
    try {
      const allSales = SalesStorage.getAll()
      const allCustomers = CustomerStorage.getAll()
      const allPackages = CustomerPackageStorage.getAll()
      const allSessions = SessionStorage.getAll()
      
      setSales(allSales)
      setCustomers(allCustomers)
      setPackages(allPackages)
      setSessions(allSessions)
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate metrics based on selected period
  const getFilteredData = () => {
    const now = new Date()
    let startDate: Date
    
    switch (selectedPeriod) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "this-week":
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000)
        startDate.setHours(0, 0, 0, 0)
        break
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "last-month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        return {
          sales: sales.filter(sale => sale.saleDate >= startDate && sale.saleDate <= endDate),
          sessions: sessions.filter(session => session.scheduledDate >= startDate && session.scheduledDate <= endDate),
          packages: packages.filter(pkg => pkg.purchaseDate >= startDate && pkg.purchaseDate <= endDate)
        }
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    
    return {
      sales: sales.filter(sale => sale.saleDate >= startDate),
      sessions: sessions.filter(session => session.scheduledDate >= startDate),
      packages: packages.filter(pkg => pkg.purchaseDate >= startDate)
    }
  }

  const { sales: filteredSales, sessions: filteredSessions, packages: filteredPackages } = getFilteredData()

  // Calculate key metrics
  const metrics = {
    totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.amount, 0),
    totalSales: filteredSales.length,
    totalCustomers: new Set(filteredSales.map(sale => sale.customerId)).size,
    totalSessions: filteredSessions.length,
    completedSessions: filteredSessions.filter(session => session.status === 'completed').length,
    activePackages: packages.filter(pkg => pkg.status === 'active').length,
    completionRate: filteredSessions.length > 0 
      ? Math.round((filteredSessions.filter(s => s.status === 'completed').length / filteredSessions.length) * 100)
      : 0
  }

  // Package type analysis
  const packageTypeStats = filteredSales.reduce((acc, sale) => {
    const type = sale.packageType
    if (!acc[type]) {
      acc[type] = { count: 0, revenue: 0, name: sale.packageName }
    }
    acc[type].count += 1
    acc[type].revenue += sale.amount
    return acc
  }, {} as Record<string, { count: number; revenue: number; name: string }>)

  // Top customers
  const customerStats = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.customerId]) {
      acc[sale.customerId] = { 
        name: sale.customerName, 
        totalSpent: 0, 
        packageCount: 0 
      }
    }
    acc[sale.customerId].totalSpent += sale.amount
    acc[sale.customerId].packageCount += 1
    return acc
  }, {} as Record<string, { name: string; totalSpent: number; packageCount: number }>)

  const topCustomers = Object.values(customerStats)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)

  // Daily revenue for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const dailyRevenue = last7Days.map(date => {
    const dayRevenue = sales
      .filter(sale => sale.saleDate.toDateString() === date.toDateString())
      .reduce((sum, sale) => sum + sale.amount, 0)
    return {
      date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      revenue: dayRevenue
    }
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
          <p className="text-gray-600">Thống kê hoạt động kinh doanh</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="this-week">Tuần này</SelectItem>
              <SelectItem value="this-month">Tháng này</SelectItem>
              <SelectItem value="last-month">Tháng trước</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalRevenue.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-green-100 text-xs">
              {metrics.totalSales} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-blue-100 text-xs">
              Khách hàng mua hàng
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi massage</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedSessions}</div>
            <p className="text-purple-100 text-xs">
              Trên tổng {metrics.totalSessions} buổi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <p className="text-amber-100 text-xs">
              Buổi massage hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Hiệu quả gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(packageTypeStats).map(([type, stats]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div>
                      <p className="font-medium">{stats.name}</p>
                      <p className="text-sm text-gray-600">{stats.count} gói đã bán</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {stats.revenue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
              
              {Object.keys(packageTypeStats).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Chưa có dữ liệu bán hàng trong kỳ này
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top khách hàng VIP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-600">
                        {customer.packageCount} gói
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {customer.totalSpent.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
              
              {topCustomers.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Chưa có dữ liệu khách hàng trong kỳ này
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Doanh thu 7 ngày qua
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyRevenue.map((day, index) => {
              const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue))
              const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">
                    {day.date}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-32 text-right text-sm font-medium">
                    {day.revenue.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Business Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Thông tin kinh doanh
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Hiệu quả hoạt động</h4>
              <ul className="space-y-1 text-sm">
                <li>• Tỷ lệ hoàn thành: {metrics.completionRate}%</li>
                <li>• Gói đang hoạt động: {metrics.activePackages}</li>
                <li>• Doanh thu trung bình/giao dịch: {metrics.totalSales > 0 ? Math.round(metrics.totalRevenue / metrics.totalSales).toLocaleString('vi-VN') : 0}đ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Xu hướng khách hàng</h4>
              <ul className="space-y-1 text-sm">
                <li>• Tổng khách hàng: {customers.length}</li>
                <li>• Khách hàng có gói active: {new Set(packages.filter(p => p.status === 'active').map(p => p.customerId)).size}</li>
                <li>• Tỷ lệ khách hàng quay lại: {customers.length > 0 ? Math.round((topCustomers.filter(c => c.packageCount > 1).length / customers.length) * 100) : 0}%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}