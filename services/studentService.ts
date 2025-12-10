import { Student, Gender, ClassLevel, DashboardStats } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'ps_students_2025';

// Helper to simulate network delay for local storage
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class StudentService {
  
  // --- Local Storage Implementation (Fallback) ---
  private getLocalStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveLocalStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  // --- Public API ---

  async getAllStudents(): Promise<Student[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('updatedAt', { ascending: false });
      
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      return data || [];
    } else {
      await delay(300);
      return this.getLocalStudents().sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) return undefined;
      return data;
    } else {
      await delay(200);
      const students = this.getLocalStudents();
      return students.find(s => s.id === id);
    }
  }

  async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'serialNo'>): Promise<Student> {
    const now = Date.now();

    if (isSupabaseConfigured && supabase) {
      // Get Max Serial No from DB
      const { data: maxData } = await supabase
        .from('students')
        .select('serialNo')
        .order('serialNo', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextSerial = (maxData?.serialNo || 0) + 1;

      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...studentData,
          serialNo: nextSerial,
          createdAt: now,
          updatedAt: now
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Local Storage Logic
      await delay(400);
      const students = this.getLocalStudents();
      const maxSerial = students.reduce((max, s) => Math.max(max, s.serialNo || 0), 0);
      
      const newStudent: Student = {
        ...studentData,
        id: Math.random().toString(36).substring(2, 9),
        serialNo: maxSerial + 1,
        createdAt: now,
        updatedAt: now,
      };

      students.push(newStudent);
      this.saveLocalStudents(students);
      return newStudent;
    }
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const updatedAt = Date.now();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .update({ ...updates, updatedAt })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Local Storage Logic
      await delay(400);
      const students = this.getLocalStudents();
      const index = students.findIndex(s => s.id === id);
      
      if (index === -1) throw new Error("Student not found");

      const updatedStudent = {
        ...students[index],
        ...updates,
        updatedAt
      };

      students[index] = updatedStudent;
      this.saveLocalStudents(students);
      return updatedStudent;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    } else {
      await delay(300);
      let students = this.getLocalStudents();
      students = students.filter(s => s.id !== id);
      this.saveLocalStudents(students);
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const students = await this.getAllStudents(); // Reuse getAll for simplicity in calculation
    
    // Note: For large datasets in Supabase, you would replace this with .select('count', { count: 'exact' }) queries
    // instead of fetching all records, but for this scale, this works fine.
    
    return {
      totalStudents: students.length,
      boysCount: students.filter(s => s.gender === Gender.Male).length,
      girlsCount: students.filter(s => s.gender === Gender.Female).length,
      fromCoverageArea: students.filter(s => s.comesFromSchoolCoverageArea).length,
      fromOtherSchools: students.filter(s => s.comesFromOtherSchools).length,
      newAdmission: students.length
    };
  }
}

export const studentService = new StudentService();