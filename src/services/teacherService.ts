// src/services/teacherService.ts
const API_URL = 'http://localhost:3001/api';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  subjectTaught: string | null;
  phoneNumber: string | null;
  compensationRate: number | null;
  createdAt: string;
  updatedAt: string;
}

export const teacherService = {
  // GET all teachers
  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const response = await fetch(`${API_URL}/teachers`);
      if (!response.ok) {
        throw new Error(`Error fetching teachers: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get all teachers:', error);
      throw error;
    }
  },

  // Add teacher
  async addTeacher(teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> {
    try {
      const response = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error adding teacher: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to add teacher:', error);
      throw error;
    }
  },

  // Get teacher details by ID
  async getTeacherDetails(teacherId: string): Promise<Teacher | null> {
    try {
      const response = await fetch(`${API_URL}/teachers/${teacherId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error fetching teacher details: ${response.statusText}`);
      }
      return await response.json();
    } catch (error)
      console.error('Failed to get teacher details:', error);
      throw error;
    }
  },

  // Update teacher
  async updateTeacher(teacherId: string, teacherData: Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Teacher> {
    try {
      const response = await fetch(`${API_URL}/teachers/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error updating teacher: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to update teacher:', error);
      throw error;
    }
  },

  // Delete teacher
  async deleteTeacher(teacherId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/teachers/${teacherId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error('Teacher not found for deletion');
        throw new Error(`Error deleting teacher: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      throw error;
    }
  }
};
