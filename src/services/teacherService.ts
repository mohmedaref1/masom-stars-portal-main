
// خدمة وهمية لإدارة المعلمين
export interface Teacher {
  id: string;
  fullName: string;
  phone: string;
  subject: string;
  registrationDate: string;
}

export const teacherService = {
  // إضافة معلم جديد
  async addTeacher(teacherData: Omit<Teacher, 'id' | 'registrationDate'>): Promise<{ success: boolean; teacherId?: string; error?: string }> {
    console.log('إرسال بيانات المعلم إلى الباك إند:', teacherData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (teacherData.fullName === 'أحمد السيد') {
      return { success: false, error: 'يوجد معلم بنفس الاسم مسجل بالفعل' };
    }
    
    const teacherId = Date.now().toString();
    return { success: true, teacherId };
  }
};
