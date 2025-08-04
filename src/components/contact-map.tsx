"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function ContactMap() {
  return (
    <Card className="shadow-lg rounded-2xl border-0 overflow-hidden h-full">
      <CardContent className="p-0 h-full min-h-[400px]">
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Bản đồ Google Maps</h3>
            <p className="text-gray-600 text-sm mb-4">Nhấn vào đây để xem vị trí chính xác trên Google Maps</p>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                <strong>Địa chỉ:</strong>
                <br />
                123 Đường Truyền Thống
                <br />
                Phường Y Học, Quận Cổ Truyền
                <br />
                TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
        {/* In a real implementation, you would embed Google Maps here */}
        {/* <iframe 
          src="https://www.google.com/maps/embed?pb=..." 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        /> */}
      </CardContent>
    </Card>
  )
}
