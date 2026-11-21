const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Excel drops the leading zero of phone numbers, and some admins type +94.
export function normalizePhone(value) {
  if (!value) return '';
  let p = String(value).replace(/[\s-]/g, '');
  if (/^7\d{8}$/.test(p)) p = `0${p}`;
  if (/^\+94\d{9}$/.test(p)) p = `0${p.slice(3)}`;
  return p;
}
const isValidPhone = (p) => /^0\d{9}$/.test(p);

function isValidPastDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(`${str}T00:00:00Z`);
  return (
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === str &&
    d <= new Date()
  );
}

// returns 'Male' | 'Female' | '' (blank) | null (invalid)
function normalizeGender(value) {
  const g = String(value || '').trim().toLowerCase();
  if (!g) return '';
  if (['male', 'm'].includes(g)) return 'Male';
  if (['female', 'f'].includes(g)) return 'Female';
  return null;
}

const required = (errors, field, value) => {
  if (!value) errors.push({ field, message: 'Required' });
};

const fullNameOf = (first, last) => `${first} ${last}`.trim();

/**
 * One config per upload type. The service runs the same pipeline over any of them.
 * prepareRow() does the checks that need no database: required fields, formats.
 */
export const BULK_TYPES = {
  teachers: {
    required: ['first_name', 'last_name', 'email'],
    columns: ['teacher_code', 'first_name', 'last_name', 'email', 'contact', 'grade_level', 'class_name'],
    example: ['T-0042', 'Nimal', 'Perera', 'nimal.perera@school.lk', '0771234567', '', ''],

    prepareRow(data) {
      const errors = [];
      const values = {
        teacherCode: data.teacher_code || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: String(data.email || '').toLowerCase(),
        phone: normalizePhone(data.phone),
        gradeLevel: data.grade_level || '',
        className: data.class_name || '',
      };
      values.fullName = fullNameOf(values.firstName, values.lastName);

      required(errors, 'first_name', values.firstName);
      required(errors, 'last_name', values.lastName);
      required(errors, 'email', values.email);
      if (values.email && !EMAIL_RE.test(values.email))
        errors.push({ field: 'email', message: 'Invalid email format' });
      if (values.phone && !isValidPhone(values.phone))
        errors.push({ field: 'phone', message: 'Invalid phone number (e.g. 0771234567)' });
      if (Boolean(values.gradeLevel) !== Boolean(values.className))
        errors.push({
          field: 'class_name',
          message: 'Fill both grade_level and class_name, or leave both blank',
        });

      return { values, errors };
    },
  },

  students: {
    required: ['admission_number', 'first_name', 'last_name', 'grade_level', 'class_name'],
    columns: [
      'admission_number', 'first_name', 'last_name', 'grade_level', 'class_name',
      'date_of_birth', 'gender', 'email', 'contact',
    ],
    example: ['2024/0153', 'Kasun', 'Silva', '5', 'A', '2015-03-21', 'Male', '', ''],

    prepareRow(data) {
      const errors = [];
      const gender = normalizeGender(data.gender);
      const values = {
        admissionNumber: data.admission_number || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        gradeLevel: data.grade_level || '',
        className: data.class_name || '',
        dateOfBirth: data.date_of_birth || '',
        gender: gender ?? '',
        email: String(data.email || '').toLowerCase(),
        phone: normalizePhone(data.phone),
      };
      values.fullName = fullNameOf(values.firstName, values.lastName);

      required(errors, 'admission_number', values.admissionNumber);
      required(errors, 'first_name', values.firstName);
      required(errors, 'last_name', values.lastName);
      required(errors, 'grade_level', values.gradeLevel);
      required(errors, 'class_name', values.className);
      if (values.dateOfBirth && !isValidPastDate(values.dateOfBirth))
        errors.push({ field: 'date_of_birth', message: 'Use YYYY-MM-DD and a date in the past' });
      if (gender === null)
        errors.push({ field: 'gender', message: 'Use Male or Female' });
      if (values.email && !EMAIL_RE.test(values.email))
        errors.push({ field: 'email', message: 'Invalid email format' });
      if (values.phone && !isValidPhone(values.phone))
        errors.push({ field: 'phone', message: 'Invalid phone number (e.g. 0771234567)' });

      return { values, errors };
    },
  },
};