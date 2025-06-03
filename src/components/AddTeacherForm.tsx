
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { teacherService } from '@/services/teacherService';
import { subjects } from '@/data/academicData';
import { ArrowRight, User, Phone, Book } from 'lucide-react';

export function AddTeacherForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    subject: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!formData.fullName || !formData.phone || !formData.subject) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await teacherService.addTeacher(formData);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تسجيل المعلم بنجاح",
        });
        setShowSuccess(true);
        // إعادة تعيين النموذج
        setFormData({
          fullName: '',
          phone: '',
          subject: ''
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error || "حدث خطأ أثناء التسجيل",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Failed to add teacher:", error);
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
              <p className="text-lg text-gray-300 mb-6">تم تسجيل المعلم بنجاح في النظام</p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary w-full"
                >
                  تسجيل معلم آخر
                </Button>
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
              <Book className="w-6 h-6 text-blue-400" />
              إضافة معلم جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white font-medium">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="اسم ولقب المعلم"
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

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white font-medium">المادة التي يدرسها *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-white hover:bg-gray-700">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل المعلم'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
