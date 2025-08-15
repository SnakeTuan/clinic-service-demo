"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  UserPlus,
  PackageCheck,
  Database,
  Trash2
} from "lucide-react"
import { 
  CustomerStorage, 
  SalesStorage, 
  SessionStorage, 
  CustomerPackageStorage 
} from "@/lib/storage"
import { generateDemoData, clearDemoData } from "@/lib/demo-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayCustomers: 0,
    todaySessions: 0,
    pendingSessions: 0,
    totalCustomers: 0,
    activePackages: 0,
    monthlyRevenue: 0,
    popularPackage: "Chưa có dữ liệu"
  })
  
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setIsLoading(true)
    try {
      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // Get all data
      const customers = CustomerStorage.getAll()
      const sales = SalesStorage.getAll()
      const sessions = SessionStorage.getAll()
      const packages = CustomerPackageStorage.getAll()
      
      // Calculate today's stats
      const todaySales = sales.filter(sale => 
        sale.saleDate >= today && sale.saleDate < tomorrow
      )
      const todaySessions = sessions.filter(session => 
        session.scheduledDate >= today && session.scheduledDate < tomorrow
      )
      
      // Calculate monthly stats
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthlySales = sales.filter(sale => sale.saleDate >= thisMonth)
      
      // Calculate stats
      const newStats = {
        todaySales: todaySales.reduce((sum, sale) => sum + sale.amount, 0),
        todayCustomers: new Set(todaySales.map(sale => sale.customerId)).size,
        todaySessions: todaySessions.filter(s => s.status === 'completed').length,
        pendingSessions: todaySessions.filter(s => s.status === 'scheduled').length,
        totalCustomers: customers.length,
        activePackages: packages.filter(pkg => pkg.status === 'active').length,
        monthlyRevenue: monthlySales.reduce((sum, sale) => sum + sale.amount, 0),
        popularPackage: getMostPopularPackage(sales)
      }
      
      setStats(newStats)
      
      // Generate recent activities
      const activities = generateRecentActivities(sales, sessions)
      setRecentActivities(activities)
      
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMostPopularPackage = (sales: any[]): string => {
    const packageCounts = sales.reduce((acc, sale) => {
      acc[sale.packageName] = (acc[sale.packageName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostPopular = Object.entries(packageCounts)
      .sort(([,a], [,b]) => b - a)[0]
    
    return mostPopular ? mostPopular[0] : "Chưa có dữ liệu"
  }

  const generateRecentActivities = (sales: any[], sessions: any[]) => {
    const activities: any[] = []
    
    // Add recent sales
    const recentSales = sales
      .sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime())
      .slice(0, 3)
    
    recentSales.forEach(sale => {
      activities.push({
        type: "sale",
        customer: sale.customerName,
        package: sale.packageName,
        amount: sale.amount,
        time: sale.saleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      })
    })
    
    // Add recent sessions
    const recentSessions = sessions
      .filter(session => session.status === 'completed')
      .sort((a, b) => (b.completedDate?.getTime() || 0) - (a.completedDate?.getTime() || 0))
      .slice(0, 2)
    
    recentSessions.forEach(session => {
      activities.push({
        type: "session",
        customer: session.customerName,
        session: `Buổi ${session.sessionNumber}`,
        therapist: session.therapist,
        time: session.completedDate?.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) || ""
      })
    })
    
    return activities.slice(0, 4)
  }

  const handleGenerateDemoData = () => {
    if (confirm("Tạo dữ liệu demo? Điều này sẽ xóa tất cả dữ liệu hiện tại.")) {
      generateDemoData()
      loadDashboardData()
      alert("Đã tạo dữ liệu demo thành công!")
    }
  }

  const handleClearData = () => {
    if (confirm("Xóa tất cả dữ liệu? Hành động này không thể hoàn tác.")) {
      clearDemoData()
      loadDashboardData()
      alert("Đã xóa tất cả dữ liệu!")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động spa hôm nay</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
          <Button variant="outline">
            <PackageCheck className="h-4 w-4 mr-2" />
            Bán gói mới
          </Button>
        </div>
      </div>

      {/* Demo Data Controls */}
      {(stats.totalCustomers === 0 || !isLoading) && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-amber-800">Dữ liệu Demo</h3>
                <p className="text-sm text-amber-600">
                  {stats.totalCustomers === 0 
                    ? "Chưa có dữ liệu. Tạo dữ liệu demo để trải nghiệm hệ thống."
                    : "Quản lý dữ liệu demo của hệ thống."
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateDemoData}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Tạo dữ liệu demo
                </Button>
                {stats.totalCustomers > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearData}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa dữ liệu
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySales.toLocaleString('vi-VN')}đ</div>
            <p className="text-green-100 text-xs">
              {stats.todayCustomers > 0 ? `${stats.todayCustomers} khách hàng` : "Chưa có giao dịch"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCustomers}</div>
            <p className="text-blue-100 text-xs">Hôm nay</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi massage</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySessions}</div>
            <p className="text-purple-100 text-xs">{stats.pendingSessions} đang chờ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-amber-100 text-xs">{stats.activePackages} gói đang sử dụng</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Chưa có hoạt động nào</p>
                <p className="text-sm">Các giao dịch và buổi massage sẽ hiển thị ở đây</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'sale' ? 'bg-green-500' : 
                        activity.type === 'session' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{activity.customer}</p>
                        <p className="text-sm text-gray-600">
                          {activity.type === 'sale' && `Mua gói ${activity.package}`}
                          {activity.type === 'session' && `${activity.session} - ${activity.therapist}`}
                          {activity.type === 'booking' && `Đặt lịch ${activity.session}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.time}</p>
                      {activity.amount && (
                        <p className="text-xs text-green-600">+{activity.amount.toLocaleString('vi-VN')}đ</p>
                      )}
                      {activity.status && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.status === 'scheduled' ? 'Đã đặt' : activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Doanh thu tháng</span>
              <span className="font-medium">{stats.monthlyRevenue.toLocaleString('vi-VN')}đ</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gói phổ biến nhất</span>
              <Badge className="bg-green-100 text-green-800">{stats.popularPackage}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
              <span className="font-medium text-green-600">
                {stats.todaySessions > 0 ? "100%" : "N/A"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Khách hàng quay lại</span>
              <span className="font-medium text-blue-600">
                {stats.totalCustomers > 0 ? "78%" : "N/A"}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Xem lịch hôm nay
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Bán gói nhanh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}