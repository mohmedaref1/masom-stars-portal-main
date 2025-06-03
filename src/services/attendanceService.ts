
// خدمة وهمية لإدارة الحضور
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  groupId: string;
  groupName: string;
  attendanceTime: string;
  isPaid: boolean;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  studentName?: string;
  groups?: string[];
  conflictingGroups?: { id: string; name: string }[];
  alreadyAttended?: boolean;
  isPaid?: boolean;
}

export const attendanceService = {
  // تسجيل الحضور عند مسح البطاقة
  async recordAttendance(studentId: string): Promise<AttendanceResponse> {
    console.log('تسجيل حضور الطالب:', studentId);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // محاكاة حالات مختلفة
    const random = Math.random();
    
    if (random < 0.1) {
      // الطالب غير موجود
      return {
        success: false,
        message: 'الطالب غير موجود في النظام'
      };
    } else if (random < 0.2) {
      // تم تسجيل الحضور مسبقاً
      return {
        success: false,
        message: 'تم تسجيل حضور الطالب مسبقاً لهذه الحصة',
        studentName: 'محمد أحمد',
        alreadyAttended: true
      };
    } else if (random < 0.3) {
      // لا توجد حصة نشطة
      return {
        success: false,
        message: 'لا توجد حصة نشطة حاليًا لهذا الطالب',
        studentName: 'سارة علي',
        groups: ['رياضيات المتوسط الأولى', 'فيزياء الثانوي الثانية']
      };
    } else if (random < 0.4) {
      // تضارب في المجموعات
      return {
        success: false,
        message: 'يوجد تضارب في أوقات المجموعات',
        studentName: 'عمر محمود',
        conflictingGroups: [
          { id: '1', name: 'رياضيات المتوسط الأولى' },
          { id: '2', name: 'علوم طبيعية المتوسط الأولى' }
        ]
      };
    } else if (random < 0.6) {
      // نجح التسجيل لكن لم يتم الدفع
      return {
        success: true,
        message: 'تم تسجيل الحضور بنجاح',
        studentName: 'فاطمة حسن',
        isPaid: false
      };
    } else {
      // نجح التسجيل مع الدفع
      return {
        success: true,
        message: 'تم تسجيل الحضور بنجاح',
        studentName: 'يوسف إبراهيم',
        isPaid: true
      };
    }
  },

  // تسجيل الحضور لمجموعة محددة (في حالة التضارب)
  async recordAttendanceForGroup(studentId: string, groupId: string): Promise<AttendanceResponse> {
    console.log('تسجيل الحضور للمجموعة المحددة:', { studentId, groupId });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'تم تسجيل الحضور بنجاح للمجموعة المحددة',
      studentName: 'الطالب المختار',
      isPaid: Math.random() > 0.5
    };
  },

  // تأكيد حضور المعلم
  async confirmTeacherAttendance(sessionId: string, attended: boolean): Promise<{ success: boolean; error?: string }> {
    console.log('تأكيد حضور المعلم:', { sessionId, attended });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!attended) {
      // حذف جميع سجلات الحضور للحصة
      console.log('حذف جميع سجلات الحضور للحصة:', sessionId);
    }
    
    return { success: true };
  },

  // جلب سجلات الحضور للحصة
  async getSessionAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        studentId: '1',
        studentName: 'محمد أحمد',
        sessionId,
        groupId: '1',
        groupName: 'رياضيات المتوسط الأولى',
        attendanceTime: new Date().toISOString(),
        isPaid: true
      }
    ];
  }
};
