
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { attendanceService, AttendanceResponse } from '@/services/attendanceService';
import { Scan, User, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AttendanceSystem() {
  const [studentId, setStudentId] = useState('');
  const [lastScanResult, setLastScanResult] = useState<AttendanceResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showGroupSelection, setShowGroupSelection] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentScannedStudentIdForSelection, setCurrentScannedStudentIdForSelection] = useState<string | null>(null); // Added state

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // محاكاة مسح الباركود
  const handleBarcodeScan = async (scannedId: string) => {
    if (!scannedId.trim()) {
      toast.error('يرجى إدخال رقم الطالب');
      return;
    }

    setIsScanning(true);
    setLastScanResult(null);

    try {
      const result = await attendanceService.recordAttendance(scannedId);
      // Store studentId if group selection is needed
      if (result.conflictingGroups) {
        setCurrentScannedStudentIdForSelection(scannedId);
      }
      setLastScanResult(result);
      
      if (result.success) {
        if (result.isPaid) {
          toast.success(`تم تسجيل حضور ${result.studentName} بنجاح`);
        } else {
          toast.warning(`تم تسجيل حضور ${result.studentName} - لم يتم الدفع`);
        }
      } else if (result.conflictingGroups) {
        setShowGroupSelection(true);
      } else {
        toast.error(result.message);
      }
      
      setStudentId(''); // Clear input field regardless
    } catch (error) {
      console.error('خطأ في تسجيل الحضور:', error);
      toast.error('حدث خطأ في تسجيل الحضور');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGroupSelection = async (groupId: string) => {
    if (!lastScanResult?.conflictingGroups || !currentScannedStudentIdForSelection) {
      toast.error("خطأ: لم يتم تحديد الطالب لاختيار المجموعة.");
      setIsScanning(false); // Ensure isScanning is reset
      setShowGroupSelection(false); // Hide selection options
      return;
    }

    setIsScanning(true);
    try {
      const result = await attendanceService.recordAttendanceForGroup(currentScannedStudentIdForSelection, groupId);
      setLastScanResult(result);
      setShowGroupSelection(false);
      
      if (result.success) {
        if (result.isPaid) {
          toast.success(`تم تسجيل حضور ${result.studentName} بنجاح`);
        } else {
          toast.warning(`تم تسجيل حضور ${result.studentName} - لم يتم الدفع`);
        }
      } else { // Handle cases where recordAttendanceForGroup itself might fail (e.g., student not in group after all)
        toast.error(result.message || 'فشل تسجيل الحضور للمجموعة المختارة');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الحضور للمجموعة:', error);
      toast.error('حدث خطأ في تسجيل الحضور للمجموعة');
    } finally {
      setIsScanning(false);
      setCurrentScannedStudentIdForSelection(null); // Clear the stored student ID
    }
  };

  const renderScanResult = () => {
    if (!lastScanResult) return null;

    if (lastScanResult.success) {
      return (
        <Alert className="border-green-600 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            <div className="font-semibold mb-2">✅ تم تسجيل الحضور بنجاح</div>
            <div>الطالب: {lastScanResult.studentName}</div>
            <div>الوقت: {currentTime.toLocaleTimeString('ar-DZ')}</div>
            {!lastScanResult.isPaid && (
              <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                <AlertTriangle className="inline w-4 h-4 ml-2 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">⚠️ هذه الحصة لم يتم دفع ثمنها بعد</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    } else if (lastScanResult.alreadyAttended) {
      return (
        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            <div className="font-semibold mb-2">⚠️ تحذير</div>
            <div>الطالب: {lastScanResult.studentName}</div>
            <div>{lastScanResult.message}</div>
          </AlertDescription>
        </Alert>
      );
    } else if (lastScanResult.groups && lastScanResult.groups.length > 0) {
      return (
        <Alert className="border-blue-600 bg-blue-900/20">
          <User className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            <div className="font-semibold mb-2">ℹ️ معلومات الطالب</div>
            <div>الطالب: {lastScanResult.studentName}</div>
            <div>{lastScanResult.message}</div>
            <div className="mt-2">
              <div className="font-semibold">المجموعات المسجل بها:</div>
              <ul className="list-disc list-inside mt-1">
                {lastScanResult.groups.map((group, index) => (
                  <li key={index} className="text-sm">{group}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      );
    } else {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">❌ خطأ</div>
            <div>{lastScanResult.message}</div>
            {lastScanResult.studentName && (
              <div>الطالب: {lastScanResult.studentName}</div>
            )}
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">نظام تسجيل الحضور</h1>
          <p className="text-gray-300">قم بمسح بطاقة الطالب لتسجيل الحضور</p>
        </div>

        {/* عرض الوقت الحالي */}
        <Card className="card-modern mb-6">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">الوقت الحالي</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {currentTime.toLocaleTimeString('ar-DZ')}
            </div>
            <div className="text-gray-400 mt-2">
              {currentTime.toLocaleDateString('ar-DZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </Card>

        {/* منطقة المسح */}
        <Card className="card-modern mb-6">
          <div className="p-6">
            <div className="text-center mb-6">
              <Scan className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">مسح بطاقة الطالب</h2>
              <p className="text-gray-400">امسح الباركود أو أدخل رقم الطالب يدوياً</p>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="رقم الطالب..."
                className="input-modern flex-1"
                disabled={isScanning}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBarcodeScan(studentId);
                  }
                }}
              />
              <Button
                onClick={() => handleBarcodeScan(studentId)}
                disabled={isScanning || !studentId.trim()}
                className="btn-primary px-8"
              >
                {isScanning ? 'جارٍ المعالجة...' : 'مسح'}
              </Button>
            </div>
          </div>
        </Card>

        {/* نتيجة المسح */}
        {renderScanResult()}

        {/* اختيار المجموعة في حالة التضارب */}
        {showGroupSelection && lastScanResult?.conflictingGroups && (
          <Card className="card-modern mt-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">اختر المجموعة</h3>
              <p className="text-gray-300 mb-4">
                يوجد تضارب في أوقات المجموعات للطالب {lastScanResult.studentName}. 
                يرجى اختيار المجموعة التي تريد تسجيل الحضور فيها:
              </p>
              
              <div className="space-y-3">
                {lastScanResult.conflictingGroups.map(group => (
                  <Button
                    key={group.id}
                    onClick={() => handleGroupSelection(group.id)}
                    disabled={isScanning}
                    variant="outline"
                    className="w-full p-4 h-auto border-gray-600 text-white hover:bg-gray-700"
                  >
                    <div className="text-center">
                      <div className="font-semibold">{group.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={() => setShowGroupSelection(false)}
                variant="outline"
                className="mt-4 border-gray-600 text-gray-300"
              >
                إلغاء
              </Button>
            </div>
          </Card>
        )}

        {/* معلومات إضافية */}
        <Card className="card-modern mt-6">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">معلومات هامة</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div>• يمكن تسجيل الحضور من ساعتين قبل بداية الحصة إلى ساعتين بعد بدايتها</div>
              <div>• في حالة عدم دفع رسوم الحصة، سيظهر تحذير لكن سيتم تسجيل الحضور</div>
              <div>• إذا كان الطالب مسجل في مجموعات متعددة بنفس الوقت، ستظهر نافذة لاختيار المجموعة</div>
              <div>• بعد ساعة من بداية الحصة، سيطلب النظام تأكيد حضور المعلم</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
