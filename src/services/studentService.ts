// src/services/studentService.ts
const API_URL = 'http://localhost:3001/api'; // Or your backend URL

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null; // Assuming email can be null as per schema
  dob: string | null; // Store as ISO string (YYYY-MM-DD)
  address: string | null;
  phoneNumber: string | null;
  level: string | null;
  createdAt: string; // from backend
  updatedAt: string; // from backend
  // Frontend specific fields, if needed, can be added or handled in components
  // e.g. parentPhone, hasPaidRegistration might require separate handling or different API calls
}

// The search result can be simpler or same as Student, adjust as needed
export interface StudentSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  level: string | null;
}

export const studentService = {
  // GET all students
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.statusText}`);
      }
      const students: Student[] = await response.json();
      return students.map(student => ({
        ...student,
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : null // Format to YYYY-MM-DD
      }));
    } catch (error) {
      console.error('Failed to get all students:', error);
      throw error;
    }
  },

  // Add student
  async addStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...studentData,
            dob: studentData.dob ? new Date(studentData.dob).toISOString() : null
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error adding student: ${response.statusText}`);
      }
      const newStudent: Student = await response.json();
      return {
        ...newStudent,
        dob: newStudent.dob ? new Date(newStudent.dob).toISOString().split('T')[0] : null
      };
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  },

  // Search students (backend needs to support this, for now, it gets all and filters locally)
  // TODO: Implement backend search for efficiency
  async searchStudents(query: string): Promise<StudentSearchResult[]> {
    console.log('Searching students with query:', query);
    try {
      const students = await this.getAllStudents(); // Get all students
      const lowerCaseQuery = query.toLowerCase();
      // Filter locally
      const filteredStudents = students.filter(student =>
        (student.firstName.toLowerCase().includes(lowerCaseQuery) ||
         student.lastName.toLowerCase().includes(lowerCaseQuery) ||
         (student.email && student.email.toLowerCase().includes(lowerCaseQuery)) ||
         (student.level && student.level.toLowerCase().includes(lowerCaseQuery)))
      );
      return filteredStudents.map(s => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        level: s.level,
      }));
    } catch (error) {
      console.error('Failed to search students:', error);
      throw error;
    }
  },

  // Get student details by ID
  async getStudentDetails(studentId: string): Promise<Student | null> {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error fetching student details: ${response.statusText}`);
      }
      const student: Student = await response.json();
      return {
        ...student,
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : null
      };
    } catch (error) {
      console.error('Failed to get student details:', error);
      throw error;
    }
  },

  // Update student
  async updateStudent(studentId: string, studentData: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Student> {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...studentData,
            dob: studentData.dob ? new Date(studentData.dob).toISOString() : undefined // use undefined if dob is not changing or null
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error updating student: ${response.statusText}`);
      }
      const updatedStudent: Student = await response.json();
      return {
        ...updatedStudent,
        dob: updatedStudent.dob ? new Date(updatedStudent.dob).toISOString().split('T')[0] : null
      };
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  },

  // Delete student
  async deleteStudent(studentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
         if (response.status === 404) throw new Error('Student not found for deletion');
        throw new Error(`Error deleting student: ${response.statusText}`);
      }
      // No content expected for a successful delete
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  }
};
