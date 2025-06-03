import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BackToHomeButton } from "./BackToHomeButton";

interface Teacher {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
}

interface Session {
  id: string;
  date: string;
  group: string;
  teacher: string;
  compensated: boolean;
}

// Mock data
const teachers: Teacher[] = [
  { id: '1', name: 'أحمد محمد' },
  { id: '2', name: 'فاطمة علي' },
  { id: '3', name: 'يوسف خالد' }
];

const groups: Group[] = [
  { id: '1', name: 'رياضيات الصف الأول' },
  { id: '2', name: 'علوم الصف الثاني' },
  { id: '3', name: 'لغة عربية الصف الثالث' }
];

const sessions: Session[] = [
  { id: '1', date: '2024-06-01', group: '1', teacher: '1', compensated: false },
  { id: '2', date: '2024-06-01', group: '2', teacher: '2', compensated: true },
  { id: '3', date: '2024-06-02', group: '1', teacher: '1', compensated: false },
  { id: '4', date: '2024-06-02', group: '3', teacher: '3', compensated: true }
];

export const TeacherCompensation = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sessionsToCompensate, setSessionsToCompensate] = useState<Session[]>([]);
  const { toast } = useToast();

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSearchSessions = () => {
    if (!selectedTeacher || !selectedGroup || !startDate || !endDate) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    const filteredSessions = sessions.filter(
      (session) =>
        session.teacher === selectedTeacher &&
        session.group === selectedGroup &&
        session.date >= startDate &&
        session.date <= endDate &&
        !session.compensated
    );

    setSessionsToCompensate(filteredSessions);
  };

  const handleCompensateSession = (sessionId: string) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, compensated: true } : session
    );

    // Here you would typically call an API to update the session
    // For this example, we just update the local state
    setSessionsToCompensate((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );

    toast({
      title: "تم",
      description: "تم تعويض الحصة بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <BackToHomeButton />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تعويضات المعلمين</h1>
          <p className="text-gray-400">حساب وإدارة تعويضات المعلمين</p>
        </div>

        <Card className="card-modern mb-6">
          <CardHeader>
            <CardTitle className="text-xl">بحث عن الحصص</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher">المعلم</Label>
                <Select onValueChange={handleTeacherChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المعلم" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group">المجموعة</Label>
                <Select onValueChange={handleGroupChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المجموعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">من تاريخ</Label>
                <Input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} className="input-modern" />
              </div>
              <div>
                <Label htmlFor="endDate">إلى تاريخ</Label>
                <Input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} className="input-modern" />
              </div>
            </div>
            <Button onClick={handleSearchSessions} className="btn-primary">
              <Calendar className="w-4 h-4 ml-2" />
              بحث عن الحصص
            </Button>
          </CardContent>
        </Card>

        {sessionsToCompensate.length > 0 && (
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl">الحصص المراد تعويضها</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsToCompensate.map((session) => (
                <div key={session.id} className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                  <div>
                    <p className="text-white">
                      التاريخ: {session.date}, المجموعة: {groups.find((g) => g.id === session.group)?.name}, المعلم: {teachers.find((t) => t.id === session.teacher)?.name}
                    </p>
                  </div>
                  <Button onClick={() => handleCompensateSession(session.id)} className="btn-secondary">
                    <DollarSign className="w-4 h-4 ml-2" />
                    تعويض
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
