"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle } from "lucide-react"

export default function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    symptoms: "",
    date: "",
    time: "",
    service: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-green-50 border-green-200 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-green-800 mb-4">Cảm ơn bạn đã đặt lịch!</h3>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ trong vòng 24 giờ để xác nhận lịch khám và tư vấn
              chi tiết.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cam kết của chúng tôi:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Liên hệ xác nhận trong 24h</li>
                <li>• Tư vấn miễn phí qua điện thoại</li>
                <li>• Hỗ trợ đặt lịch phù hợp nhất</li>
              </ul>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
            >
              Đặt lịch khác
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
          <CardTitle className="text-2xl font-serif text-center">Đặt Lịch Khám</CardTitle>
          <CardDescription className="text-green-100 text-center">
            Vui lòng điền đầy đủ thông tin để được phục vụ tốt nhất
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-800 font-medium">
                  Họ và tên *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên đầy đủ"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-green-800 font-medium">
                  Số điện thoại *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123 456 789"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-green-800 font-medium">
                Dịch vụ quan tâm
              </Label>
              <Select onValueChange={(value) => handleInputChange("service", value)}>
                <SelectTrigger className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Chọn dịch vụ bạn quan tâm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acupuncture">Gói Châm Cứu Cổ Truyền</SelectItem>
                  <SelectItem value="herbal">Gói Bấm Huyệt & Thảo Dược</SelectItem>
                  <SelectItem value="rehabilitation">Gói Phục Hồi Chức Năng</SelectItem>
                  <SelectItem value="consultation">Tư vấn chung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-green-800 font-medium">
                Triệu chứng hoặc vấn đề sức khỏe *
              </Label>
              <Textarea
                id="symptoms"
                placeholder="Mô tả chi tiết triệu chứng, thời gian xuất hiện, mức độ nghiêm trọng..."
                value={formData.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                required
                rows={4}
                className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-green-800 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ngày mong muốn *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-green-800 font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Giờ mong muốn *
                </Label>
                <Select onValueChange={(value) => handleInputChange("time", value)} required>
                  <SelectTrigger className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Chọn giờ khám" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                    <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                    <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                    <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                    <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                    <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Lưu ý:</strong> Đây là lịch đăng ký sơ bộ. Chúng tôi sẽ liên hệ để xác nhận và có thể điều chỉnh
                thời gian phù hợp với lịch trình của bác sĩ.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-3 text-lg font-medium"
            >
              Gửi yêu cầu đặt lịch
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
