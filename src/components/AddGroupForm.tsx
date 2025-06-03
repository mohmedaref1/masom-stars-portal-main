
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { groupService } from '@/services/groupService';
import { sessionService } from '@/services/sessionService';
import { teacherService } from '@/services/teacherService';
import { academicLevels, subjects } from '@/data/academicData';
import { Checkbox } from "@/components/ui/checkbox";

const weekdays = [
  { value: 0, label: 'الأحد' },
  { value: 1, label: 'الاثنين' },
  { value: 2, label: 'الثلاثاء' },
  { value: 3, label: 'الأربعاء' },
  { value: 4, label: 'الخميس' },
  { value: 5, label: 'الجمعة' },
  { value: 6, label: 'السبت' }
];

export function AddGroupForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    teacherId: '',
    compatibleLevels: [] as string[],
    pricePerFourSessions: 0,
    defaultWeekday: 0,
    defaultTime: '16:00',
    sessionDuration: 90,
    firstSessionDate: ''
  });

  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // جلب المعلمين عند تغيير المادة
  useEffect(() => {
    if (formData.subject) {
      loadTeachersBySubject();
    }
  }, [formData.subject]);

  const loadTeachersBySubject = async () => {
    try {
      // هنا يجب جلب المعلمين من الباك إند حسب المادة
      // مؤقتاً سنستخدم بيانات وهمية
      setTeachers([
        { id: '1', fullName: 'أحمد محمد', subject: formData.subject },
        { id: '2', fullName: 'فاطمة علي', subject: formData.subject }
      ]);
    } catch (error) {
      console.error('خطأ في جلب المعلمين:', error);
    }
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        compatibleLevels: [...prev.compatibleLevels, level]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        compatibleLevels: prev.compatibleLevels.filter(l => l !== level)
      }));
    }
  };

  const calculateFirstSessionDate = () => {
    const today = new Date();
    const targetWeekday = formData.defaultWeekday;
    const currentWeekday = today.getDay();
    
    let daysUntilTarget = targetWeekday - currentWeekday;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // الأسبوع القادم
    }
    
    const firstSession = new Date(today);
    firstSession.setDate(today.getDate() + daysUntilTarget);
    
    return firstSession.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.teacherId || formData.compatibleLevels.length === 0) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // إضافة المجموعة
      const groupResult = await groupService.addGroup({
        name: formData.name,
        subject: formData.subject,
        teacherId: formData.teacherId,
        teacherName: teachers.find(t => t.id === formData.teacherId)?.fullName || '',
        compatibleLevels: formData.compatibleLevels,
        pricePerFourSessions: formData.pricePerFourSessions,
        defaultWeekday: formData.defaultWeekday,
        defaultTime: formData.defaultTime,
        sessionDuration: formData.sessionDuration
      });

      if (!groupResult.success) {
        setError(groupResult.error || 'فشل في إضافة المجموعة');
        return;
      }

      // توليد الحصص
      const firstSessionDate = formData.firstSessionDate || calculateFirstSessionDate();
      const sessionsResult = await sessionService.generateWeeklySessions(
        groupResult.groupId!,
        formData.defaultWeekday,
        formData.defaultTime,
        firstSessionDate
      );

      if (!sessionsResult.success) {
        setError(sessionsResult.error || 'فشل في توليد الحصص');
        return;
      }

      toast.success('تم إضافة المجموعة وتوليد الحصص بنجاح');
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        subject: '',
        teacherId: '',
        compatibleLevels: [],
        pricePerFourSessions: 0,
        defaultWeekday: 0,
        defaultTime: '16:00',
        sessionDuration: 90,
        firstSessionDate: ''
      });
      setTeachers([]);

    } catch (error) {
      console.error('خطأ في إضافة المجموعة:', error);
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">إضافة مجموعة جديدة</h1>
          <p className="text-gray-300">قم بإدخال بيانات المجموعة وسيتم توليد الحصص تلقائياً</p>
        </div>

        <Card className="card-modern">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">اسم المجموعة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-modern"
                  placeholder="مثال: رياضيات المتوسط الأولى"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">المادة *</Label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value, teacherId: '' }))}
                  className="input-modern w-full"
                  required
                >
                  <option value="">اختر المادة</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {formData.subject && (
                <div className="space-y-2">
                  <Label htmlFor="teacherId" className="text-white">المعلم *</Label>
                  <select
                    id="teacherId"
                    value={formData.teacherId}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="input-modern w-full"
                    required
                  >
                    <option value="">اختر المعلم</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">السعر لكل 4 حصص (دج) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.pricePerFourSessions}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerFourSessions: Number(e.target.value) }))}
                  className="input-modern"
                  placeholder="2000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">المستويات الدراسية المتوافقة *</Label>
              <div className="grid md:grid-cols-3 gap-4">
                {academicLevels.map(level => (
                  <div key={level} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={level}
                      checked={formData.compatibleLevels.includes(level)}
                      onCheckedChange={(checked) => handleLevelChange(level, checked as boolean)}
                    />
                    <Label htmlFor={level} className="text-gray-300 text-sm">{level}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weekday" className="text-white">اليوم الأسبوعي *</Label>
                <select
                  id="weekday"
                  value={formData.defaultWeekday}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultWeekday: Number(e.target.value) }))}
                  className="input-modern w-full"
                  required
                >
                  {weekdays.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-white">وقت البداية *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.defaultTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultTime: e.target.value }))}
                  className="input-modern"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white">مدة الحصة (دقيقة)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, sessionDuration: Number(e.target.value) }))}
                  className="input-modern"
                  min="30"
                  max="180"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstSessionDate" className="text-white">تاريخ أول حصة (اختياري)</Label>
              <Input
                id="firstSessionDate"
                type="date"
                value={formData.firstSessionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, firstSessionDate: e.target.value }))}
                className="input-modern w-full md:w-1/3"
              />
              <p className="text-gray-400 text-sm">
                إذا تُرك فارغاً، سيتم اختيار أقرب {weekdays.find(d => d.value === formData.defaultWeekday)?.label} قادم
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'جارٍ الحفظ...' : 'إضافة المجموعة'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
