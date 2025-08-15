"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  ShoppingCart, 
  DollarSign,
  Package,
  Users,
  Calendar,
  Plus,
  CheckCircle
} from "lucide-react"
import { Customer, Package as SpaPackage, CustomerPackage, Sale, PaymentMethod } from "@/types/spa"
import { 
  CustomerStorage, 
  PackageStorage, 
  CustomerPackageStorage, 
  SalesStorage 
} from "@/lib/storage"

export default function SalesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [packages, setPackages] = useState<SpaPackage[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<SpaPackage | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [customerSearch, setCustomerSearch] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allCustomers = CustomerStorage.getAll()
    const activePackages = PackageStorage.getActivePackages()
    
    setCustomers(allCustomers)
    setPackages(activePackages)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  )

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch(customer.name)
  }

  const handlePackageSelect = (pkg: SpaPackage) => {
    setSelectedPackage(pkg)
  }

  const handleProcessSale = async () => {
    if (!selectedCustomer || !selectedPackage) {
      alert("Vui lòng chọn khách hàng và gói dịch vụ")
      return
    }

    setIsProcessing(true)

    try {
      // Create customer package
      const customerPackageData: Omit<CustomerPackage, 'id'> = {
        customerId: selectedCustomer.id,
        packageId: selectedPackage.id,
        packageType: selectedPackage.type,
        packageName: selectedPackage.name,
        purchaseDate: new Date(),
        totalSessions: selectedPackage.sessions,
        sessionsUsed: 0,
        sessionsRemaining: selectedPackage.sessions,
        paymentMethod,
        amount: selectedPackage.price,
        status: 'active'
      }

      const packageResult = CustomerPackageStorage.create(customerPackageData)
      
      if (!packageResult.success) {
        throw new Error(packageResult.error || "Không thể tạo gói khách hàng")
      }

      // Create sales record
      const saleData: Omit<Sale, 'id'> = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        packageId: selectedPackage.id,
        packageType: selectedPackage.type,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        paymentMethod,
        saleDate: new Date(),
        staffMember: "Admin" // In real app, this would be current user
      }

      const saleResult = SalesStorage.create(saleData)
      
      if (!saleResult.success) {
        throw new Error(saleResult.error || "Không thể ghi nhận giao dịch")
      }

      // Show success and reset form
      setShowSuccess(true)
      setSelectedCustomer(null)
      setSelectedPackage(null)
      setCustomerSearch("")
      setPaymentMethod('cash')

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

    } catch (error) {
      console.error("Error processing sale:", error)
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý giao dịch")
    } finally {
      setIsProcessing(false)
    }
  }

  const totalAmount = selectedPackage ? selectedPackage.price : 0
  const savings = selectedPackage 
    ? (selectedPackage.sessions * selectedPackage.pricePerSession) - selectedPackage.price 
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bán gói dịch vụ</h1>
          <p className="text-gray-600">Bán gói massage cho khách hàng</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Đã bán gói thành công!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Chọn khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm khách hàng..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Customer */}
            {selectedCustomer && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">{selectedCustomer.name}</p>
                    <p className="text-sm text-green-600">{selectedCustomer.phone}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            )}

            {/* Customer List */}
            {customerSearch && !selectedCustomer && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredCustomers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Không tìm thấy khách hàng
                  </p>
                ) : (
                  filteredCustomers.slice(0, 10).map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {!selectedCustomer && !customerSearch && (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Nhập tên hoặc số điện thoại để tìm khách hàng</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Chọn gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {pkg.sessions} buổi
                        </Badge>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {pkg.price.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-xs text-gray-500">
                            {pkg.pricePerSession.toLocaleString('vi-VN')}đ/buổi
                          </p>
                        </div>
                      </div>
                    </div>
                    {selectedPackage?.id === pkg.id && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment & Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phương thức thanh toán</label>
              <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="card">Thẻ ngân hàng</SelectItem>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {selectedPackage && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Tóm tắt đơn hàng</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gói dịch vụ:</span>
                    <span className="font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số buổi:</span>
                    <span>{selectedPackage.sessions} buổi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá gốc:</span>
                    <span>{(selectedPackage.sessions * selectedPackage.pricePerSession).toLocaleString('vi-VN')}đ</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Tiết kiệm:</span>
                      <span>-{savings.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            )}

            {/* Process Sale Button */}
            <Button
              onClick={handleProcessSale}
              disabled={!selectedCustomer || !selectedPackage || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                "Đang xử lý..."
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Hoàn tất bán hàng
                </>
              )}
            </Button>

            {(!selectedCustomer || !selectedPackage) && (
              <p className="text-xs text-gray-500 text-center">
                Vui lòng chọn khách hàng và gói dịch vụ
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Customer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Khách hàng mới?</h3>
              <p className="text-sm text-blue-600">
                Thêm khách hàng mới trước khi bán gói dịch vụ
              </p>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}