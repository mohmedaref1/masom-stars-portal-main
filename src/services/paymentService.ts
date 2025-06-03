
// خدمة وهمية لإدارة المدفوعات
export interface PaymentSession {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  date: string;
  startTime: string;
  endTime: string;
  isPresent: boolean;
  studentPaidForSession: boolean;
  studentAbsentAndForcedPaid: boolean;
  teacherPaidForSession: boolean;
  canExclude: boolean; // إذا كان يمكن استثناء الحصة من الدفع
}

export interface StudentPaymentInfo {
  studentId: string;
  studentName: string;
  studentLevel: string;
  groupId: string;
  groupName: string;
  pricePerFourSessions: number;
  unpaidSessions: PaymentSession[];
  totalAmountDue: number;
}

export interface TeacherCompensationInfo {
  teacherId: string;
  teacherName: string;
  groupId: string;
  groupName: string;
  pricePerFourSessions: number;
  teacherSharePerFourSessions: number;
  associationSharePerFourSessions: number;
  sessions: PaymentSession[];
  totalCompensation: number;
}

export interface PaymentConfirmation {
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  teacherName: string;
  paidSessions: PaymentSession[];
  totalAmount: number;
  paymentDate: string;
  pricePerFourSessions: number;
}

export const paymentService = {
  // جلب معلومات دفع الطالب
  async getStudentPaymentInfo(studentId: string, groupId: string): Promise<{ success: boolean; data?: StudentPaymentInfo; error?: string }> {
    console.log('جلب معلومات دفع الطالب:', { studentId, groupId });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockSessions: PaymentSession[] = [
      {
        id: '1',
        sessionId: 'session_1',
        studentId,
        studentName: 'محمد أحمد',
        groupId,
        groupName: 'رياضيات المتوسط الأولى',
        date: '2024-05-27',
        startTime: '16:00',
        endTime: '17:30',
        isPresent: true,
        studentPaidForSession: false,
        studentAbsentAndForcedPaid: false,
        teacherPaidForSession: false,
        canExclude: false
      },
      {
        id: '2',
        sessionId: 'session_2',
        studentId,
        studentName: 'محمد أحمد',
        groupId,
        groupName: 'رياضيات المتوسط الأولى',
        date: '2024-05-20',
        startTime: '16:00',
        endTime: '17:30',
        isPresent: false,
        studentPaidForSession: false,
        studentAbsentAndForcedPaid: false,
        teacherPaidForSession: false,
        canExclude: true
      },
      {
        id: '3',
        sessionId: 'session_3',
        studentId,
        studentName: 'محمد أحمد',
        groupId,
        groupName: 'رياضيات المتوسط الأولى',
        date: '2024-05-13',
        startTime: '16:00',
        endTime: '17:30',
        isPresent: false,
        studentPaidForSession: false,
        studentAbsentAndForcedPaid: true,
        teacherPaidForSession: false,
        canExclude: false
      },
      {
        id: '4',
        sessionId: 'session_4',
        studentId,
        studentName: 'محمد أحمد',
        groupId,
        groupName: 'رياضيات المتوسط الأولى',
        date: '2024-05-06',
        startTime: '16:00',
        endTime: '17:30',
        isPresent: true,
        studentPaidForSession: false,
        studentAbsentAndForcedPaid: false,
        teacherPaidForSession: false,
        canExclude: false
      }
    ];

    const paymentInfo: StudentPaymentInfo = {
      studentId,
      studentName: 'محمد أحمد',
      studentLevel: 'المتوسط - السنة الأولى',
      groupId,
      groupName: 'رياضيات المتوسط الأولى',
      pricePerFourSessions: 2000,
      unpaidSessions: mockSessions,
      totalAmountDue: 2000
    };

    return { success: true, data: paymentInfo };
  },

  // تأكيد دفع الطالب
  async confirmStudentPayment(studentId: string, groupId: string, sessionIds: string[], excludedSessionIds: string[]): Promise<{ success: boolean; confirmation?: PaymentConfirmation; error?: string }> {
    console.log('تأكيد دفع الطالب:', { studentId, groupId, sessionIds, excludedSessionIds });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const confirmation: PaymentConfirmation = {
      studentId,
      studentName: 'محمد أحمد',
      groupId,
      groupName: 'رياضيات المتوسط الأولى',
      teacherName: 'أحمد محمد',
      paidSessions: [],
      totalAmount: 2000,
      paymentDate: new Date().toISOString().split('T')[0],
      pricePerFourSessions: 2000
    };

    return { success: true, confirmation };
  },

  // جلب معلومات تعويضات المعلم
  async getTeacherCompensationInfo(teacherId: string, startDate: string, endDate: string): Promise<{ success: boolean; data?: TeacherCompensationInfo[]; error?: string }> {
    console.log('جلب معلومات تعويضات المعلم:', { teacherId, startDate, endDate });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCompensationInfo: TeacherCompensationInfo[] = [
      {
        teacherId,
        teacherName: 'أحمد محمد',
        groupId: '1',
        groupName: 'رياضيات المتوسط الأولى',
        pricePerFourSessions: 2000,
        teacherSharePerFourSessions: 1500,
        associationSharePerFourSessions: 500,
        sessions: [],
        totalCompensation: 3000
      }
    ];

    return { success: true, data: mockCompensationInfo };
  },

  // تأكيد دفع تعويضات المعلم
  async confirmTeacherCompensation(teacherId: string, compensationData: any): Promise<{ success: boolean; error?: string }> {
    console.log('تأكيد دفع تعويضات المعلم:', { teacherId, compensationData });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  },

  // إلغاء تسجيل طالب من مجموعة
  async removeStudentFromGroup(studentId: string, groupId: string): Promise<{ success: boolean; error?: string }> {
    console.log('إلغاء تسجيل الطالب من المجموعة:', { studentId, groupId });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  }
};
