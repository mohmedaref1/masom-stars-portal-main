// خدمة وهمية لإدارة الحصص
import { Session } from './groupService';

export type { Session };

export const sessionService = {
  // توليد الحصص تلقائياً للمجموعة
  async generateWeeklySessions(groupId: string, weekday: number, time: string, startDate?: string): Promise<{ success: boolean; sessions?: Session[]; error?: string }> {
    console.log('توليد الحصص الأسبوعية للمجموعة:', { groupId, weekday, time, startDate });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sessions: Session[] = [];
    const currentDate = new Date(startDate || Date.now());
    
    // توليد 12 حصة (3 أشهر)
    for (let i = 0; i < 12; i++) {
      const sessionDate = new Date(currentDate);
      sessionDate.setDate(currentDate.getDate() + (i * 7));
      
      sessions.push({
        id: `${groupId}_${i + 1}`,
        groupId,
        groupName: 'اسم المجموعة',
        date: sessionDate.toISOString().split('T')[0],
        startTime: time,
        endTime: this.calculateEndTime(time, 90),
        isActive: false,
        isCompleted: false
      });
    }
    
    return { success: true, sessions };
  },

  // حساب وقت انتهاء الحصة
  calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
  },

  // جلب الحصص الأسبوعية
  async getWeeklySessions(startDate: string, endDate: string): Promise<Session[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        groupId: '1',
        groupName: 'رياضيات المتوسط الأولى',
        date: '2024-06-03',
        startTime: '16:00',
        endTime: '17:30',
        isActive: true,
        isCompleted: false
      }
    ];
  },

  // إضافة حصة إضافية
  async addExtraSession(sessionData: Omit<Session, 'id'>): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    console.log('إضافة حصة إضافية:', sessionData);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionId = Date.now().toString();
    return { success: true, sessionId };
  },

  // تعديل حصة
  async updateSession(sessionId: string, sessionData: Partial<Session>): Promise<{ success: boolean; error?: string }> {
    console.log('تعديل الحصة:', { sessionId, sessionData });
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // حذف حصة
  async deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    console.log('حذف الحصة:', sessionId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};
