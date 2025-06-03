import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BackToHomeButton } from "./BackToHomeButton";

interface Student {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  price: number;
}

// خدمة وهمية لجلب بيانات الطلاب والمجموعات
const mockStudents: Student[] = [
  { id: '1', name: 'محمد أحمد' },
  { id: '2', name: 'سارة علي' },
  { id: '3', name: 'أحمد خالد' },
];

const mockGroups: Group[] = [
  { id: '1', name: 'رياضيات - المستوى الأول', price: 1500 },
  { id: '2', name: 'علوم - المستوى الثاني', price: 1200 },
  { id: '3', name: 'لغة عربية - المستوى الثالث', price: 1000 },
];

export const StudentGroupRegistration = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [registrationDate, setRegistrationDate] = useState<string>('');
  const { toast } = useToast();

  const handleRegistration = () => {
    if (!selectedStudent || !selectedGroup || !registrationDate) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    // هنا يمكنك إضافة منطق التسجيل الفعلي
    toast({
      title: "تم التسجيل",
      description: `تم تسجيل الطالب في المجموعة بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <BackToHomeButton />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تسجيل في المجموعات</h1>
          <p className="text-gray-400">ربط الطلاب بالمجموعات الدراسية</p>
        </div>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-xl">بيانات التسجيل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="student">الطالب</Label>
                <Select onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الطالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group">المجموعة</Label>
                <Select onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المجموعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="registrationDate">تاريخ التسجيل</Label>
                <Input
                  type="date"
                  id="registrationDate"
                  className="input-modern"
                  onChange={(e) => setRegistrationDate(e.target.value)}
                />
              </div>
              <Button className="btn-primary" onClick={handleRegistration}>
                تسجيل الطالب في المجموعة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
