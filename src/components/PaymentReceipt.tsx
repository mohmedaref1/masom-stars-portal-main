
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentConfirmation } from '@/services/paymentService';
import { Printer, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface PaymentReceiptProps {
  paymentData: PaymentConfirmation;
  onClose: () => void;
}

export function PaymentReceipt({ paymentData, onClose }: PaymentReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* أزرار التحكم - لا تظهر في الطباعة */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة
          </Button>
          <Button
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            طباعة الإيصال
          </Button>
        </div>

        {/* إيصال الدفع */}
        <Card className="card-modern print:shadow-none print:border-none">
          <div className="p-8">
            {/* ترويسة الإيصال */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">جمعية النجوم الثقافية</h1>
              <h2 className="text-xl text-blue-400 mb-1">مدرسة معصم</h2>
              <p className="text-gray-300">إيصال دفع</p>
            </div>

            {/* معلومات الدفع */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">اسم الطالب:</span>
                  <span className="text-white font-semibold">{paymentData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">المجموعة:</span>
                  <span className="text-white font-semibold">{paymentData.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">الأستاذ:</span>
                  <span className="text-white font-semibold">{paymentData.teacherName}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">تاريخ الدفع:</span>
                  <span className="text-white font-semibold">
                    {new Date(paymentData.paymentDate).toLocaleDateString('ar-DZ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">سعر 4 حصص:</span>
                  <span className="text-white font-semibold">
                    {paymentData.pricePerFourSessions.toLocaleString()} دج
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <span className="text-gray-300 font-semibold">المبلغ المدفوع:</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {paymentData.totalAmount.toLocaleString()} دج
                  </span>
                </div>
              </div>
            </div>

            {/* التمثيل البصري للحصص */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4">حالة الحصص المدفوعة:</h3>
              <div className="grid grid-cols-4 gap-4">
                {paymentData.paidSessions.map((session, index) => (
                  <div key={session.id} className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-lg border-2 flex items-center justify-center mb-2 ${
                      session.studentPaidForSession
                        ? 'bg-green-900/30 border-green-500'
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      {session.studentPaidForSession ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300">
                      حصة {index + 1}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(session.date).toLocaleDateString('ar-DZ')}
                    </p>
                    <p className={`text-xs ${session.isPresent ? 'text-green-400' : 'text-red-400'}`}>
                      {session.isPresent ? 'حضر' : 'غاب'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ملاحظات */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm text-center">
                هذا الإيصال صالح كدليل على الدفع ويرجى الاحتفاظ به
              </p>
            </div>

            {/* رقم الإيصال */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-xs">
                رقم الإيصال: {paymentData.studentId}-{paymentData.groupId}-{Date.now()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .card-modern {
            background: white !important;
            color: black !important;
          }
          .text-white {
            color: black !important;
          }
          .text-gray-300,
          .text-gray-400 {
            color: #666 !important;
          }
          .text-blue-400 {
            color: #1e40af !important;
          }
          .bg-green-900\\/30 {
            background: #dcfce7 !important;
          }
          .border-green-500 {
            border-color: #22c55e !important;
          }
        }
      `}</style>
    </div>
  );
}
