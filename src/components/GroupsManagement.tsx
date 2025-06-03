
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { groupService, Group } from '@/services/groupService';
import { Plus, Users, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GroupsManagement() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await groupService.getAllGroups();
      setGroups(data);
      setError(null); // Clear any previous error
    } catch (err: any) {
      console.error('خطأ في جلب المجموعات:', err);
      setError(err.message || 'فشل تحميل المجموعات. الخدمة غير متوفرة حالياً.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="flex items-center justify-center">
          <div className="text-white text-lg">جارٍ تحميل المجموعات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة المجموعات</h1>
            <p className="text-gray-300">عرض وإدارة جميع المجموعات الدراسية</p>
          </div>
          
          <Button
            onClick={() => navigate('/add-group')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة مجموعة جديدة
          </Button>
        </div>

        {error && (
          <Card className="card-modern text-center py-12 bg-red-900/20 border-red-700">
            <div className="text-red-400 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">خطأ في تحميل المجموعات</h3>
              <p>{error}</p>
            </div>
            <Button
              onClick={loadGroups}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? 'جاري المحاولة...' : 'حاول مرة أخرى'}
            </Button>
          </Card>
        )}

        {!error && groups.length === 0 && !loading && (
          <Card className="card-modern text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">لا توجد مجموعات</h3>
              <p>قم بإضافة أول مجموعة دراسية</p>
            </div>
            <Button
              onClick={() => navigate('/add-group')}
              className="btn-primary"
            >
              إضافة مجموعة جديدة
            </Button>
          </Card>
        )}

        {!error && groups.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <Card key={group.id} className="card-modern">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{group.name}</h3>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                      {group.subject}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{group.studentsCount} طالب مسجل</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>الحصة رقم {group.currentSessionNumber}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{group.pricePerFourSessions} دج لكل 4 حصص</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-semibold">المعلم:</span> {group.teacherName}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-semibold">الوقت:</span> {group.defaultTime} - {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][group.defaultWeekday]}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-semibold">المستويات:</span>
                      <div className="mt-1">
                        {group.compatibleLevels.map((level, index) => (
                          <span key={level} className="text-xs bg-gray-700 px-2 py-1 rounded mr-1 mb-1 inline-block">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      تعديل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
