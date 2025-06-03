
// خدمة وهمية لإدارة التقارير المالية
export interface FinancialSummary {
  totalStudentPayments: number; // إجمالي المدفوعات من الطلاب
  totalTeacherPayments: number; // إجمالي المدفوعات للمعلمين
  totalRegistrationFees: number; // إجمالي رسوم الاشتراك
  netIncome: number; // صافي الدخل
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface DetailedTransaction {
  id: string;
  type: 'student_payment' | 'teacher_payment' | 'registration_fee';
  studentName?: string;
  teacherName?: string;
  groupName?: string;
  amount: number;
  date: string;
  description: string;
}

export const financialService = {
  // جلب الملخص المالي
  async getFinancialSummary(startDate: string, endDate: string): Promise<{ success: boolean; data?: FinancialSummary; error?: string }> {
    console.log('جلب الملخص المالي:', { startDate, endDate });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const summary: FinancialSummary = {
      totalStudentPayments: 45000,
      totalTeacherPayments: 32000,
      totalRegistrationFees: 8000,
      netIncome: 21000, // 45000 + 8000 - 32000
      period: {
        startDate,
        endDate
      }
    };

    return { success: true, data: summary };
  },

  // جلب المعاملات المفصلة
  async getDetailedTransactions(startDate: string, endDate: string): Promise<{ success: boolean; data?: DetailedTransaction[]; error?: string }> {
    console.log('جلب المعاملات المفصلة:', { startDate, endDate });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const transactions: DetailedTransaction[] = [
      {
        id: '1',
        type: 'student_payment',
        studentName: 'محمد أحمد',
        groupName: 'رياضيات المتوسط الأولى',
        amount: 2000,
        date: '2024-06-01',
        description: 'دفع 4 حصص - رياضيات المتوسط الأولى'
      },
      {
        id: '2',
        type: 'teacher_payment',
        teacherName: 'أحمد محمد',
        groupName: 'رياضيات المتوسط الأولى',
        amount: 1500,
        date: '2024-06-01',
        description: 'تعويضات 4 حصص - رياضيات المتوسط الأولى'
      },
      {
        id: '3',
        type: 'registration_fee',
        studentName: 'سارة علي',
        amount: 500,
        date: '2024-06-02',
        description: 'رسوم الاشتراك الأولية'
      }
    ];

    return { success: true, data: transactions };
  }
};
