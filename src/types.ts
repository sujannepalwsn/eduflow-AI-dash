export interface Book {
  id?: string;
  title: string;
  subject: string;
  class: string;
  file_path?: string;
  created_at?: string;
}

export interface BookContent {
  id?: string;
  book_id: string;
  unit: string;
  chapter?: string;
  lesson: string;
  topic: string;
  sub_topic?: string;
  content: string; // Summary for lesson planning
  full_content?: string; // High-fidelity content for the reader
  goals: string;
  key_points?: string[];
  examples?: string[];
  formulas?: string[];
  page_number?: number;
  created_at?: string;
}

export interface LessonPlan {
  id?: string;
  book_content_id?: string;
  subject: string;
  class: string;
  unit?: string;
  period?: string;
  lesson_topic: string;
  date?: string;
  learning_outcomes?: string;
  warm_up_review?: string;
  teaching_activities?: string[];
  evaluation?: string[];
  class_work?: string[];
  home_assignment?: string[];
  remarks?: string;
  created_at?: string;
  center_id?: string;
  teacher_id?: string;
  objectives?: string;
  learning_activities?: string[];
  evaluation_activities?: string[];
  principal_remarks?: string;
  chapter?: string;
}

export interface Question {
  id?: string;
  book_id: string;
  book_content_id: string;
  type: 'mcq' | 'short' | 'long' | 'fill_in_the_blanks';
  question_text: string;
  options?: any;
  correct_answer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bloom_level?: string;
  marks?: number;
  created_at?: string;
}

export interface TestResult {
  id?: string;
  student_id: string;
  test_id: string;
  score: number;
  feedback?: string;
  ai_feedback?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  center_id: string;
  class: string;
  parent_id?: string;
}

export type UserRole = 'admin' | 'center' | 'teacher' | 'parent';

export interface LinkedStudent {
  id: string;
  name: string;
  grade: string | null;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  center_id: string | null;
  center_name?: string;
  student_id?: string | null;
  student_name?: string;
  teacher_id?: string | null;
  teacher_name?: string;
  centerPermissions?: Record<string, any>;
  teacherPermissions?: Record<string, any>;
  teacher_scope_mode?: 'full' | 'restricted';
  linked_students?: LinkedStudent[];
  untrusted_metadata?: {
    permissions_fetched_at: string;
    is_ui_restricted: boolean;
  };
}
