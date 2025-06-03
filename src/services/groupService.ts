
// خدمة وهمية لإدارة المجموعات
export interface Group {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  compatibleLevels: string[];
  pricePerFourSessions: number;
  defaultWeekday: number; // 0-6 (Sunday-Saturday)
  defaultTime: string; // HH:MM format
  sessionDuration: number; // in minutes, default 90
  createdAt: string;
  studentsCount: number;
  currentSessionNumber: number;
}

export interface Session {
  id: string;
  groupId: string;
  groupName: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isCompleted: boolean;
  teacherPresent?: boolean;
}

export const groupService = {
  // إضافة مجموعة جديدة
  async addGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'studentsCount' | 'currentSessionNumber'>): Promise<{ success: boolean; groupId?: string; error?: string }> {
    console.log('إرسال بيانات المجموعة إلى الباك إند:', groupData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // التحقق من القيد: لا أكثر من 5 مجموعات في نفس الوقت
    const conflictingGroupsCount = await this.checkTimeConflict(groupData.defaultWeekday, groupData.defaultTime);
    if (conflictingGroupsCount >= 5) {
      return { success: false, error: 'لا يمكن برمجة أكثر من 5 حصص في نفس الوقت' };
    }
    
    const groupId = Date.now().toString();
    return { success: true, groupId };
  },

  // التحقق من تضارب الأوقات
  async checkTimeConflict(weekday: number, time: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // محاكاة عدد المجموعات المتضاربة
    return Math.floor(Math.random() * 3);
  },

  // جلب جميع المجموعات
  async getAllGroups(): Promise<Group[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        name: 'رياضيات المتوسط الأولى',
        subject: 'رياضيات',
        teacherId: '1',
        teacherName: 'أحمد محمد',
        compatibleLevels: ['المتوسط - السنة الأولى'],
        pricePerFourSessions: 2000,
        defaultWeekday: 1,
        defaultTime: '16:00',
        sessionDuration: 90,
        createdAt: '2024-01-15',
        studentsCount: 12,
        currentSessionNumber: 8
      }
    ];
  },

  // جلب المجموعات المتوافقة مع مستوى الطالب
  async getCompatibleGroups(studentLevel: string): Promise<Group[]> {
    const allGroups = await this.getAllGroups();
    return allGroups.filter(group => group.compatibleLevels.includes(studentLevel));
  }
};
