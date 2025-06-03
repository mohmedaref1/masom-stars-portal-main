
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { studentService, type Student } from '@/services/studentService';
import { academicLevels, days, months, years } from '@/data/academicData';
import { ArrowRight, Calendar, User, Phone } from 'lucide-react';

export function AddStudentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    parentPhone: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    level: '',
    hasPaidRegistration: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!formData.fullName || !formData.phone || !formData.parentPhone || 
        !formData.birthDay || !formData.birthMonth || !formData.birthYear || !formData.level) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة التاريخ
    const day = parseInt(formData.birthDay);
    const month = parseInt(formData.birthMonth);
    const year = parseInt(formData.birthYear);
    
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      toast({
        title: "خطأ",
        description: "تاريخ الميلاد غير صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const studentData = {
        fullName: formData.fullName,
        phone: formData.phone,
        parentPhone: formData.parentPhone,
        birthDate: { day, month, year },
        level: formData.level,
        hasPaidRegistration: formData.hasPaidRegistration
      };

      const result = await studentService.addStudent(studentData);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تسجيل الطالب بنجاح",
        });
        setShowSuccess(true);
        // إعادة تعيين النموذج
        setFormData({
          fullName: '',
          phone: '',
          parentPhone: '',
          birthDay: '',
          birthMonth: '',
          birthYear: '',
          level: '',
          hasPaidRegistration: false
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error || "حدث خطأ أثناء التسجيل",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Failed to add student:", error);
      toast({
        title: "خطأ",
        description: error?.message || "حدث خطأ في الاتصال بالخادم",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <a href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </a>
          </div>
          
          <Card className="card-modern animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400 mb-4">تم التسجيل بنجاح! ✅</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-300 mb-6">تم تسجيل الطالب بنجاح في النظام</p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary w-full"
                >
                  تسجيل طالب آخر
                </Button>
                <div className="text-sm text-gray-400 p-4 bg-gray-800 rounded-lg">
                  <p>الخطوة التالية: تسجيل الطالب في المجموعات</p>
                  <p className="text-xs mt-2">(هذه الميزة ستكون متاحة في المراحل القادمة)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <a href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </a>
        </div>

        <Card className="card-modern animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <User className="w-6 h-6 text-blue-400" />
              إضافة طالب جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* البيانات الشخصية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white font-medium">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="اسم ولقب الطالب"
                    className="input-modern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white font-medium">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0555123456"
                    className="input-modern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone" className="text-white font-medium">رقم هاتف الولي *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    placeholder="0666789012"
                    className="input-modern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">المستوى الدراسي *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="اختر المستوى الدراسي" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {academicLevels.map((level) => (
                        <SelectItem key={level} value={level} className="text-white hover:bg-gray-700">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* تاريخ الميلاد */}
              <div className="space-y-4">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ الميلاد *
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Select value={formData.birthDay} onValueChange={(value) => setFormData(prev => ({ ...prev, birthDay: value }))}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="اليوم" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()} className="text-white hover:bg-gray-700">
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={formData.birthMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, birthMonth: value }))}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="الشهر" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()} className="text-white hover:bg-gray-700">
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={formData.birthYear} onValueChange={(value) => setFormData(prev => ({ ...prev, birthYear: value }))}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="السنة" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-700">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* حالة دفع الرسوم */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="hasPaidRegistration"
                  checked={formData.hasPaidRegistration}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasPaidRegistration: Boolean(checked) }))}
                  className="border-gray-600"
                />
                <Label htmlFor="hasPaidRegistration" className="text-white font-medium">
                  تم دفع رسوم الاشتراك الأولية
                </Label>
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل الطالب'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
