
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentConfirmation } from '@/services/paymentService';
import { Printer, ArrowRight, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface PaymentCheckProps {
  paymentData: PaymentConfirmation;
  onClose: () => void;
}

export function PaymentCheck({ paymentData, onClose }: PaymentCheckProps) {
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
            طباعة الشيك
          </Button>
        </div>

        {/* الشيك */}
        <Card className="card-modern print:shadow-none print:border-2 print:border-black">
          <div className="p-8">
            {/* ترويسة الشيك */}
            <div className="text-center mb-8 border-b-2 border-gray-700 print:border-black pb-4">
              <h1 className="text-3xl font-bold text-white print:text-black mb-2">
                جمعية النجوم الثقافية
              </h1>
              <h2 className="text-xl text-blue-400 print:text-black mb-1">مدرسة معصم</h2>
              <p className="text-gray-300 print:text-gray-700 font-semibold">شيك دفع رسوم الحصص</p>
            </div>

            {/* معلومات الدفع الأساسية */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700 print:border-gray-400 pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">اسم التلميذ:</span>
                  <span className="text-white print:text-black font-bold text-lg">
                    {paymentData.studentName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-700 print:border-gray-400 pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">اسم الفوج:</span>
                  <span className="text-white print:text-black font-bold">
                    {paymentData.groupName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-700 print:border-gray-400 pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">اسم الأستاذ:</span>
                  <span className="text-white print:text-black font-bold">
                    {paymentData.teacherName}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700 print:border-gray-400 pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">تاريخ الدفع:</span>
                  <span className="text-white print:text-black font-bold">
                    {new Date(paymentData.paymentDate).toLocaleDateString('ar-DZ')}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-700 print:border-gray-400 pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">سعر 4 حصص:</span>
                  <span className="text-white print:text-black font-bold">
                    {paymentData.pricePerFourSessions.toLocaleString()} دج
                  </span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-blue-600 print:border-black pb-2">
                  <span className="text-gray-300 print:text-gray-700 font-medium">المبلغ المدفوع:</span>
                  <span className="text-blue-400 print:text-black font-bold text-xl">
                    {paymentData.totalAmount.toLocaleString()} دج
                  </span>
                </div>
              </div>
            </div>

            {/* التمثيل البصري ثنائي للحضور والدفع */}
            <div className="mb-8">
              <h3 className="text-white print:text-black font-bold mb-6 text-center text-lg">
                جدول الحصص المدفوعة
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-gray-700 print:border-black">
                  <thead>
                    <tr className="bg-gray-800 print:bg-gray-200">
                      <th className="border border-gray-700 print:border-black p-3 text-white print:text-black text-center">
                        رقم الحصة
                      </th>
                      <th className="border border-gray-700 print:border-black p-3 text-white print:text-black text-center">
                        التاريخ
                      </th>
                      <th className="border border-gray-700 print:border-black p-3 text-white print:text-black text-center">
                        حالة الحضور
                      </th>
                      <th className="border border-gray-700 print:border-black p-3 text-white print:text-black text-center">
                        حالة دفع الطالب
                      </th>
                      <th className="border border-gray-700 print:border-black p-3 text-white print:text-black text-center">
                        حالة دفع المعلم
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.paidSessions.map((session, index) => (
                      <tr key={session.id} className="text-center">
                        <td className="border border-gray-700 print:border-black p-3 text-white print:text-black font-semibold">
                          {index + 1}
                        </td>
                        <td className="border border-gray-700 print:border-black p-3 text-white print:text-black">
                          {new Date(session.date).toLocaleDateString('ar-DZ')}
                        </td>
                        <td className="border border-gray-700 print:border-black p-3">
                          <div className="flex items-center justify-center">
                            {session.isPresent ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-400 print:text-green-600 ml-1" />
                                <span className="text-green-400 print:text-green-600 font-semibold">حضر</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-400 print:text-red-600 ml-1" />
                                <span className="text-red-400 print:text-red-600 font-semibold">غاب</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-700 print:border-black p-3">
                          <div className="flex items-center justify-center">
                            {session.studentPaidForSession ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-400 print:text-green-600 ml-1" />
                                <span className="text-green-400 print:text-green-600 font-semibold">مدفوع</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-gray-400 ml-1" />
                                <span className="text-gray-400 print:text-gray-600">غير مدفوع</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-700 print:border-black p-3">
                          <div className="flex items-center justify-center">
                            {session.teacherPaidForSession ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-blue-400 print:text-blue-600 ml-1" />
                                <span className="text-blue-400 print:text-blue-600 font-semibold">مستحق</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-gray-400 ml-1" />
                                <span className="text-gray-400 print:text-gray-600">لم يستحق</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ملخص مالي */}
            <div className="bg-blue-900/20 print:bg-gray-100 border-2 border-blue-600 print:border-black rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-blue-400 print:text-black ml-2" />
                <h3 className="text-xl font-bold text-white print:text-black">ملخص الدفع</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div className="text-center">
                  <div className="text-gray-300 print:text-gray-700 mb-1">عدد الحصص</div>
                  <div className="text-white print:text-black font-bold">
                    {paymentData.paidSessions.length} حصة
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-300 print:text-gray-700 mb-1">المبلغ الإجمالي</div>
                  <div className="text-blue-400 print:text-black font-bold text-2xl">
                    {paymentData.totalAmount.toLocaleString()} دج
                  </div>
                </div>
              </div>
            </div>

            {/* ذيل الشيك */}
            <div className="border-t-2 border-gray-700 print:border-black pt-6">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-gray-400 print:text-gray-700 mb-2">توقيع المسؤول</div>
                  <div className="border-b border-gray-700 print:border-black w-32 h-8"></div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 print:text-gray-700 text-sm">
                    رقم الشيك: {paymentData.studentId}-{paymentData.groupId}-{Date.now()}
                  </div>
                  <div className="text-gray-500 print:text-gray-600 text-xs mt-2">
                    تم إصدار هذا الشيك تلقائياً بواسطة نظام مدرسة معصم
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 print:text-gray-700 mb-2">ختم الجمعية</div>
                  <div className="border border-gray-700 print:border-black rounded-full w-16 h-16"></div>
                </div>
              </div>
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
          .bg-gray-800 {
            background: #f3f4f6 !important;
          }
          .bg-blue-900\\/20 {
            background: #f3f4f6 !important;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
