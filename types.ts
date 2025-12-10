export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum ClassLevel {
  PrePrimary = "Pre-Primary",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5"
}

export const AGE_GROUPS = [
  "4+", "5+", "6+", "7+", "8+", "9+", "10+", "11+", "12+", "13+", "14+", "15+"
];

export interface Student {
  id: string; // Firestore ID
  serialNo: number;
  childName: string;
  fatherName: string;
  motherName: string;
  ageGroup: string;
  gender: Gender;
  class: ClassLevel;
  previousSchool?: string;
  comesFromSchoolCoverageArea: boolean;
  comesFromOtherSchools: boolean;
  guardianPhone: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DashboardStats {
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
  fromCoverageArea: number;
  fromOtherSchools: number;
  newAdmission: number; // Inferred as total for now or logic based
}

export interface AgeGroupReportRow {
  ageGroup: string;
  boysTotal: number;
  girlsTotal: number;
  classBreakdown: Record<string, { boys: number; girls: number }>;
}