
// خدمة وهمية لإدارة الطلاب - ستحل محلها خدمات حقيقية مع Julia AI
export interface Student {
  id: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  birthDate: {
    day: number;
    month: number;
    year: number;
  };
  level: string;
  hasPaidRegistration: boolean;
  registrationDate: string;
}

export interface StudentSearchResult {
  id: string;
  fullName: string;
  level: string;
}

// خدمة وهمية للتفاعل مع الباك إند
export const studentService = {
  // إضافة طالب جديد
  async addStudent(studentData: Omit<Student, 'id' | 'registrationDate'>): Promise<{ success: boolean; studentId?: string; error?: string }> {
    console.log('إرسال بيانات الطالب إلى الباك إند:', studentData);
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // محاكاة التحقق من التكرار
    if (studentData.fullName === 'محمد أحمد') {
      return { success: false, error: 'يوجد طالب بنفس الاسم مسجل بالفعل' };
    }
    
    const studentId = Date.now().toString();
    return { success: true, studentId };
  },

  // البحث عن الطلاب
  async searchStudents(query: string): Promise<StudentSearchResult[]> {
    console.log('البحث عن الطلاب:', query);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // بيانات وهمية للتجربة
    const mockStudents: StudentSearchResult[] = [
      { id: '1', fullName: 'أحمد محمد الأسود', level: 'الثانوي - السنة الثالثة (علوم تجريبية)' },
      { id: '2', fullName: 'فاطمة سعيد النوري', level: 'المتوسط - السنة الثانية' },
      { id: '3', fullName: 'محمد عبد الله الحميد', level: 'الابتدائي - السنة الخامسة' }
    ];
    
    return mockStudents.filter(student => 
      student.fullName.includes(query) || student.id.includes(query)
    );
  },

  // جلب تفاصيل طالب
  async getStudentDetails(studentId: string): Promise<Student | null> {
    console.log('جلب تفاصيل الطالب:', studentId);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // بيانات وهمية
    const mockStudent: Student = {
      id: studentId,
      fullName: 'أحمد محمد الأسود',
      phone: '0555123456',
      parentPhone: '0666789012',
      birthDate: { day: 15, month: 3, year: 2005 },
      level: 'الثانوي - السنة الثالثة (علوم تجريبية)',
      hasPaidRegistration: true,
      registrationDate: '2024-01-15'
    };
    
    return mockStudent;
  }
};
