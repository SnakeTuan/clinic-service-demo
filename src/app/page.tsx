import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Star, Leaf, Zap } from "lucide-react"
import Image from "next/image"
import BookingForm from "@/components/booking-form"
import ContactMap from "@/components/contact-map"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600" />
                <Zap className="h-4 w-4 text-amber-600 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-green-800">Phòng khám</h1>
                <p className="text-sm text-green-600 -mt-1">DaoTriệu Gia</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-green-700 hover:text-green-900 font-medium">
                Trang Chủ
              </a>
              <a href="#about" className="text-green-700 hover:text-green-900 font-medium">
                Giới Thiệu
              </a>
              <a href="#services" className="text-green-700 hover:text-green-900 font-medium">
                Dịch Vụ
              </a>
              <a href="#booking" className="text-green-700 hover:text-green-900 font-medium">
                Đặt Lịch
              </a>
              <a href="#testimonials" className="text-green-700 hover:text-green-900 font-medium">
                Cảm Nhận
              </a>
              <a href="#contact" className="text-green-700 hover:text-green-900 font-medium">
                Liên Hệ
              </a>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                <Phone className="h-4 w-4 mr-2" />
                Gọi Ngay
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 rounded-full px-6"
              >
                <a href="/admin">Quản lý</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-sm px-4 py-2">
                Dao dược truyền thống
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-green-900 leading-tight">
                Ứng dụng Dao dược Triệu Gia
              </h1>
              <p className="text-xl text-green-700 font-medium">Hồi sinh cân bằng sức khỏe</p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Kết hợp tinh hoa y học cổ truyền Dao với công nghệ hiện đại, mang đến giải pháp chăm sóc sức khỏe toàn
                diện và bền vững.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 text-lg">
                  Đặt lịch ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8 py-3 text-lg bg-transparent"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-200 to-amber-200 rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Phòng khám Dao dược Triệu Gia"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-green-900 mb-4">Giới Thiệu Phòng Khám</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Với hơn 20 năm kinh nghiệm trong lĩnh vực y học cổ truyền, chúng tôi tự hào là đơn vị tiên phong ứng dụng
              Dao dược Triệu Gia tại Việt Nam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-green-50 border-green-200 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <CardHeader className="text-center">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Thầy thuốc Nguyễn Văn A"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4 shadow-md"
                />
                <CardTitle className="text-green-800 font-serif">Thầy thuốc Nguyễn Văn A</CardTitle>
                <CardDescription className="text-green-600">Trưởng khoa Dao dược</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-3">30 năm kinh nghiệm, Tiến sĩ Y học cổ truyền</p>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Chứng chỉ Dao dược quốc tế
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <CardHeader className="text-center">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Bác sĩ Trần Thị B"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4 shadow-md"
                />
                <CardTitle className="text-green-800 font-serif">Bác sĩ Trần Thị B</CardTitle>
                <CardDescription className="text-green-600">Chuyên gia châm cứu</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-3">15 năm kinh nghiệm, Thạc sĩ Y học cổ truyền</p>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Chứng chỉ châm cứu quốc tế
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 shadow-lg hover:shadow-xl transition-shadow rounded-2xl md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Thầy thuốc Lê Văn C"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4 shadow-md"
                />
                <CardTitle className="text-green-800 font-serif">Thầy thuốc Lê Văn C</CardTitle>
                <CardDescription className="text-green-600">Chuyên gia thảo dược</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-3">25 năm kinh nghiệm, Chuyên gia dược liệu</p>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Chứng chỉ dược liệu cổ truyền
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gradient-to-b from-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-green-900 mb-4">Dịch Vụ Chăm Sóc Sức Khỏe</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Các gói liệu trình được thiết kế riêng biệt, kết hợp tinh hoa y học cổ truyền và công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-serif text-green-800">Gói Châm Cứu Cổ Truyền</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center">
                  Điều trị bằng phương pháp châm cứu truyền thống kết hợp kỹ thuật Dao dược hiện đại
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Thăm khám và tư vấn chi tiết
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    10 buổi châm cứu chuyên sâu
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Theo dõi và đánh giá định kỳ
                  </li>
                </ul>
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-green-600">2.500.000đ</p>
                  <p className="text-sm text-gray-500">Giá tham khảo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-serif text-green-800">Gói Bấm Huyệt & Thảo Dược</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center">
                  Kết hợp bấm huyệt điều trị với bài thuốc thảo dược được bào chế theo công thức Dao dược
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Thăm khám và chẩn đoán toàn diện
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>8 buổi bấm huyệt + thuốc thảo dược
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Hướng dẫn chế độ dinh dưỡng
                  </li>
                </ul>
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-amber-600">3.200.000đ</p>
                  <p className="text-sm text-gray-500">Giá tham khảo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="flex">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <Leaf className="h-6 w-6 text-green-600 -ml-2" />
                  </div>
                </div>
                <CardTitle className="text-xl font-serif text-green-800">Gói Phục Hồi Chức Năng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center">
                  Liệu trình tổng hợp kết hợp châm cứu, bấm huyệt, thảo dược và vật lý trị liệu
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Đánh giá và lập kế hoạch điều trị
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    15 buổi điều trị tổng hợp
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Tái khám và theo dõi 3 tháng
                  </li>
                </ul>
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-blue-600">4.800.000đ</p>
                  <p className="text-sm text-gray-500">Giá tham khảo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-green-900 mb-4">Đặt Lịch Khám & Tư Vấn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Để lại thông tin để được tư vấn miễn phí và đặt lịch khám phù hợp nhất
            </p>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-green-900 mb-4">Cảm Nhận Khách Hàng</h2>
            <p className="text-lg text-gray-600">
              Những chia sẻ chân thực từ bệnh nhân đã được điều trị tại phòng khám
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Chị Lan"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-green-800">Chị Lan (Hà Nội)</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Sau 2 tháng điều trị bằng phương pháp Dao dược, tôi cảm thấy cơ thể khỏe mạnh hơn rất nhiều. Đau lưng
                  mãn tính đã giảm đáng kể và giấc ngủ cũng sâu hơn."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Anh Minh"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-green-800">Anh Minh (TP.HCM)</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Phòng khám rất chuyên nghiệp, các thầy thuốc tận tâm. Gói điều trị tổng hợp đã giúp tôi phục hồi chức
                  năng vai gáy sau tai nạn một cách hiệu quả."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border-0 md:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Cô Hương"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-green-800">Cô Hương (Đà Nẵng)</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Tôi đã thử nhiều phương pháp điều trị nhưng chỉ có Dao dược mới thực sự hiệu quả. Viêm khớp gối đã
                  thuyên giảm và tôi có thể đi lại bình thường trở lại."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-green-900 mb-4">Liên Hệ & Bản Đồ</h2>
            <p className="text-lg text-gray-600">Hãy đến thăm chúng tôi hoặc liên hệ để được tư vấn chi tiết</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="bg-green-50 border-green-200 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Địa chỉ</h3>
                      <p className="text-gray-600">
                        123 Đường Truyền Thống, Phường Y Học,
                        <br />
                        Quận Cổ Truyền, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Hotline</h3>
                      <p className="text-gray-600 font-medium">0123 456 789</p>
                      <p className="text-sm text-gray-500">Hỗ trợ 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Email</h3>
                      <p className="text-gray-600">info@daotrieugia.vn</p>
                      <p className="text-sm text-gray-500">Phản hồi trong 24h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Giờ mở cửa</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                        <p>Thứ 7: 8:00 - 16:00</p>
                        <p>Chủ nhật: 9:00 - 15:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <ContactMap />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <Leaf className="h-8 w-8 text-green-400" />
                  <Zap className="h-4 w-4 text-amber-400 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold">Phòng khám</h3>
                  <p className="text-green-300 -mt-1">DaoTriệu Gia</p>
                </div>
              </div>
              <p className="text-green-200 mb-4">
                Ứng dụng tinh hoa y học cổ truyền Dao dược, mang đến sức khỏe bền vững cho cộng đồng.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#booking" className="hover:text-white transition-colors">
                    Đặt lịch
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
              <div className="space-y-2 text-green-200">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  0123 456 789
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@daotrieugia.vn
                </p>
                <p className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  123 Đường Truyền Thống, TP.HCM
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-300">
            <p>&copy; 2024 Phòng khám Dao dược Triệu Gia. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
