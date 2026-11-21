import type { RegType } from "../types";

export interface ColumnDoc {
  name: string;
  required: boolean;
  rules: string;
}

export const COLUMN_DOCS: Record<RegType, ColumnDoc[]> = {
  teacher: [
    { name: "teacher_code", required: false, rules: "The school's own code for the teacher, unique within the school, e.g. T-0042" },
    { name: "first_name", required: true, rules: "Teacher's first name" },
    { name: "last_name", required: true, rules: "Teacher's last name" },
    { name: "email", required: true, rules: "Valid email, must be unique in the system" },
    { name: "contact", required: false, rules: "Phone number, e.g. 0771234567" },
    { name: "grade_level", required: false, rules: "Class teachers only, e.g. 5. Fill together with class_name" },
    { name: "class_name", required: false, rules: "Class teachers only, e.g. A. The class must already exist and have no class teacher" },
  ],
  student: [
    { name: "admission_number", required: true, rules: "Unique within the school, e.g. 2024/0153" },
    { name: "first_name", required: true, rules: "Student's first name" },
    { name: "last_name", required: true, rules: "Student's last name" },
    { name: "grade_level", required: true, rules: "e.g. 5. Must match an existing class" },
    { name: "class_name", required: true, rules: "e.g. A. Must match an existing class" },
    { name: "date_of_birth", required: false, rules: "YYYY-MM-DD, e.g. 2015-03-21" },
    { name: "gender", required: false, rules: "Male or Female" },
    { name: "email", required: false, rules: "Leave blank if the student has none (a placeholder login is generated)" },
    { name: "contact", required: false, rules: "Phone number, e.g. 0771234567" },
  ],
};

export const NOTES: Record<RegType, string[]> = {
  teacher: [
    "The system gives every teacher a unique Teacher ID automatically. Teacher code is your school's own number and can differ between schools.",
    "Leave grade_level and class_name empty for subject teachers. Fill both to make the teacher the class teacher, who handles attendance and consent forms.",
    "Create the classes first. Enter the academic year so classes can be matched.",
    "Maximum 500 rows per file. Use .csv or .xlsx (max 2 MB).",
  ],
  student: [
    "Create the classes first. Every row must match an existing class for the academic year you enter.",
    "Admission numbers must be unique within your school.",
    "Parents are not registered here. They link to their child from the mobile app.",
    "Maximum 500 rows per file. Use .csv or .xlsx (max 2 MB).",
  ],
};