import { GraduationCap, School, Users } from 'lucide-react';
import type { ColumnDef, RegType } from '../types';

/** Client-side file size limit. Matches the 2 MB limit the wizard and the backend use. */
export const MAX_FILE_MB = Number(process.env.NEXT_PUBLIC_BULK_MAX_FILE_MB ?? 2);

export const REG_COPY = {
  class: {
    label: 'Classes',
    icon: School,
    template: 'Class_Registration_Template.csv',
    columns: 'Grade, Class',
    cardDescription: 'Create all the classes in your school for an academic year at once.',
    cardNote: 'Classes that already exist for the selected year are skipped.',
    after: 'Classes are created for the selected academic year. Classes that already exist are skipped.',
    uploadNote: 'Enter a grade (1–13) and a class for each row, for example Grade 7 and Class A. Use "A" if a grade has only one class. The academic year shown applies to every row.',
    confirm: 'Valid rows will be created as classes for the selected academic year. Rows with errors, including classes that already exist, are skipped.',
    badge: 'Creates classes',
  },
  teacher: {
    label: 'Teachers',
    icon: Users,
    template: 'Teacher_Registration_Template.csv',
    columns: 'Teacher Code (optional), First Name, Last Name, Email, Contact Number (optional), Grade, Class (Grade and Class for class teachers only)',
    cardDescription: 'Import many teachers at once and create their VidyaConnect login accounts.',
    cardNote: 'Each teacher gets a login with a temporary password. You download the passwords after the import and share them.',
    after: 'Teacher profiles are created for your school, and each teacher gets a login account with a temporary password.',
    uploadNote: 'Each teacher needs a unique, valid email address. It becomes their login. For class teachers, fill in both Grade and Class. Leave both blank for other teachers.',
    confirm: 'Valid teacher rows will get a login account with a temporary password and a profile at your school. Rows with errors are skipped.',
    badge: 'Creates login accounts',
  },
  student: {
    label: 'Students',
    icon: GraduationCap,
    template: 'Student_Registration_Template.csv',
    columns: 'Admission Number, First Name, Last Name, Grade, Class',
    cardDescription: 'Import many students at once and assign each one to a grade and class.',
    cardNote: 'Students are internal records with no login. Parents link to their child from the mobile app.',
    after: 'Student profiles are saved as internal school records and assigned to their grade and class. No login accounts are created.',
    uploadNote: 'Students do not need an email or a login. Enter the academic year below so each student is matched to the right class.',
    confirm: 'Valid student rows will be saved as internal records and assigned to their grade and class. No login accounts are created. Rows with errors are skipped.',
    badge: 'Internal records, no login',
  },
} as const;

export const PREVIEW_COLUMNS: Record<RegType, ColumnDef[]> = {
  class: [
    { label: 'Grade', key: 'grade' }, { label: 'Class', key: 'className' },
  ],
  teacher: [
    { label: 'Teacher code', key: 'id' }, { label: 'First name', key: 'firstName' }, { label: 'Last name', key: 'lastName' },
    { label: 'Email', key: 'email' }, { label: 'Contact', key: 'contact' },
    { label: 'Grade', key: 'grade' }, { label: 'Class', key: 'className' },
  ],
  student: [
    { label: 'Admission no.', key: 'id' }, { label: 'First name', key: 'firstName' }, { label: 'Last name', key: 'lastName' },
    { label: 'Grade', key: 'grade' }, { label: 'Class', key: 'className' },
  ],
};

export const WIZARD_STEPS = ['Select type', 'Template & upload', 'Validate & preview', 'Confirm', 'Results'];

/** Column headers and one example row for the downloadable template. */
export const TEMPLATE_FILE: Record<RegType, { headers: string[]; example: string[] }> = {
  class: {
    headers: ['Grade', 'Class'],
    example: ['5', 'A'],
  },
  teacher: {
    headers: ['Teacher Code', 'First Name', 'Last Name', 'Email', 'Contact Number', 'Grade', 'Class'],
    example: ['T001', 'Nimal', 'Perera', 'nimal.perera@example.com', '0771234567', '5', 'A'],
  },
  student: {
    headers: ['Admission Number', 'First Name', 'Last Name', 'Grade', 'Class'],
    example: ['ADM001', 'Kasun', 'Silva', '5', 'A'],
  },
};