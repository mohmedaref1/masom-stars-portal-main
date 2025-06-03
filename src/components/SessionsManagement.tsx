
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sessionService, Session } from '@/services/sessionService';
import { groupService } from '@/services/groupService';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function SessionsManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [weekStart, setWeekStart] = useState('');

  const [newSession, setNewSession] = useState({
    groupId: '',
    date: '',
    startTime: '',
    sessionDuration: 90
  });

  useEffect(() => {
    // تعيين بداية الأسبوع الحالي
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    setWeekStart(monday.toISOString().split('T')[0]);
    
    loadData();
  }, []);

  useEffect(() => {
    if (weekStart) {
      loadWeeklySessions();
    }
  }, [weekStart]);

  const loadData = async () => {
    try {
      const [groupsData] = await Promise.all([
        groupService.getAllGroups()
      ]);
      setGroups(groupsData);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    }
  };

  const loadWeeklySessions = async () => {
    if (!weekStart) return;
    
    setLoading(true);
    try {
      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      const data = await sessionService.getWeeklySessions(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setSessions(data);
    } catch (error) {
      console.error('خطأ في جلب الحصص:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExtraSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSession.groupId || !newSession.date || !newSession.startTime) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const group = groups.find(g => g.id === newSession.groupId);
      const endTime = sessionService.calculateEndTime(newSession.startTime, newSession.sessionDuration);
      
      const result = await sessionService.addExtraSession({
        groupId: newSession.groupId,
        groupName: group?.name || '',
        date: newSession.date,
        startTime: newSession.startTime,
        endTime,
        isActive: false,
        isCompleted: false
      });

      if (result.success) {
        toast.success('تم إضافة الحصة الإضافية بنجاح');
        setShowAddForm(false);
        setNewSession({ groupId: '', date: '', startTime: '', sessionDuration: 90 });
        loadWeeklySessions();
      } else {
        toast.error(result.error || 'فشل في إضافة الحصة');
      }
    } catch (error) {
      console.error('خطأ في إضافة الحصة:', error);
      toast.error('حدث خطأ غير متوقع');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الحصة؟')) return;
    
    try {
      const result = await sessionService.deleteSession(sessionId);
      if (result.success) {
        toast.success('تم حذف الحصة بنجاح');
        loadWeeklySessions();
      } else {
        toast.error(result.error || 'فشل في حذف الحصة');
      }
    } catch (error) {
      console.error('خطأ في حذف الحصة:', error);
      toast.error('حدث خطأ غير متوقع');
    }
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push({
        date: day.toISOString().split('T')[0],
        label: day.toLocaleDateString('ar-DZ', { weekday: 'long' }),
        dayNum: day.getDate()
      });
    }
    return days;
  };

  const getSessionsForDay = (date: string) => {
    return sessions.filter(session => session.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const current = new Date(weekStart);
    const days = direction === 'next' ? 7 : -7;
    current.setDate(current.getDate() + days);
    setWeekStart(current.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="flex items-center justify-center">
          <div className="text-white text-lg">جارٍ تحميل الحصص...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة الحصص</h1>
            <p className="text-gray-300">جدولة وإدارة الحصص الأسبوعية</p>
          </div>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة حصة إضافية
          </Button>
        </div>

        {/* تنقل الأسابيع */}
        <Card className="card-modern mb-6">
          <div className="p-4 flex items-center justify-between">
            <Button
              onClick={() => changeWeek('prev')}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              الأسبوع السابق
            </Button>
            
            <div className="text-white text-lg font-semibold">
              الأسبوع من {new Date(weekStart).toLocaleDateString('ar-DZ')} إلى {new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-DZ')}
            </div>
            
            <Button
              onClick={() => changeWeek('next')}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              الأسبوع التالي
            </Button>
          </div>
        </Card>

        {/* الجدول الأسبوعي */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {getWeekDays().map(day => (
            <Card key={day.date} className="card-modern">
              <div className="p-4">
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold">{day.label}</h3>
                  <p className="text-gray-400 text-sm">{day.dayNum}</p>
                </div>
                
                <div className="space-y-2">
                  {getSessionsForDay(day.date).map(session => (
                    <div
                      key={session.id}
                      className={`p-2 rounded text-xs border ${
                        session.isActive 
                          ? 'border-green-500 bg-green-900/20 text-green-300'
                          : session.isCompleted
                          ? 'border-gray-500 bg-gray-800/50 text-gray-400'
                          : 'border-blue-500 bg-blue-900/20 text-blue-300'
                      }`}
                    >
                      <div className="font-semibold">{session.groupName}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{session.startTime}</span>
                      </div>
                      
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs border-gray-600"
                          onClick={() => {/* تعديل الحصة */}}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs border-red-600 text-red-400"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* نموذج إضافة حصة إضافية */}
        {showAddForm && (
          <Card className="card-modern">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">إضافة حصة إضافية</h3>
              
              <form onSubmit={handleAddExtraSession} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupId" className="text-white">المجموعة *</Label>
                    <select
                      id="groupId"
                      value={newSession.groupId}
                      onChange={(e) => setNewSession(prev => ({ ...prev, groupId: e.target.value }))}
                      className="input-modern w-full"
                      required
                    >
                      <option value="">اختر المجموعة</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white">التاريخ *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                      className="input-modern"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-white">وقت البداية *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSession.startTime}
                      onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                      className="input-modern"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">مدة الحصة (دقيقة)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newSession.sessionDuration}
                      onChange={(e) => setNewSession(prev => ({ ...prev, sessionDuration: Number(e.target.value) }))}
                      className="input-modern"
                      min="30"
                      max="180"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="btn-primary">
                    إضافة الحصة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
