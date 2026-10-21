const NOT_PROVIDED = 'Not provided';
const NOT_ASSIGNED = 'Not assigned';
const NOT_AVAILABLE = 'Not available';

const ROLE_CONFIG = {
  ADMIN: {
    roleTitle: 'Super Administrator',
    roleBadge: 'Super Admin',
    accountType: 'Super Admin',
    idPrefix: 'SA',
    idLabel: 'User ID',
  },
  SCHOOL_ADMIN: {
    roleTitle: 'School Administrator',
    roleBadge: 'School Admin',
    accountType: 'School Admin',
    idPrefix: 'ADM',
    idLabel: 'Admin ID',
  },
  TEACHER: {
    roleTitle: 'Teacher',
    roleBadge: 'Teacher',
    accountType: 'Teacher',
    idPrefix: 'TCH',
    idLabel: 'Teacher ID',
  },
};

export const SUPPORTED_ROLES = Object.keys(ROLE_CONFIG);

// e.g. "July 22, 2026 • 10:30 AM" (Sri Lanka time)
function formatDateTime(date) {
  if (!date) return NOT_AVAILABLE;
  const d = new Date(date);
  const day = d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Colombo',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Colombo',
  });
  return `${day} • ${time}`;
}

function personalSection(user, config) {
  return {
    title: 'Personal Information',
    icon: 'personal',
    fields: [
      { label: 'Full Name', value: user.fullName, editable: true },
      { label: 'Role', value: config.roleTitle },
      { label: 'Email Address', value: user.email, editable: true },
      { label: 'Department', value: user.department || NOT_PROVIDED },
      { label: 'Phone Number', value: user.phone || '', editable: true },
      { label: 'Joined Date', value: formatDateTime(user.createdAt) },
    ],
  };
}

function accountSection(user, config, displayId) {
  return {
    title: 'Account Information',
    icon: 'account',
    fields: [
      { label: config.idLabel, value: displayId },
      { label: 'Last Login', value: NOT_AVAILABLE },
      { label: 'Account Type', value: config.accountType },
      { label: 'Account Status', value: user.isActive ? 'Active' : 'Inactive' },
    ],
  };
}

function buildSections(user, config, displayId, extras) {
  const school = user.school;

  if (user.role === 'ADMIN') {
    const count = extras.schoolCount ?? 0;
    return [
      personalSection(user, config),
      accountSection(user, config, displayId),
      {
        title: 'System Access & Permissions',
        icon: 'access',
        fields: [
          { label: 'Access Level', value: 'Full System Access' },
          { label: 'Modules Access', value: 'All Modules' },
          { label: 'Schools Access', value: count === 1 ? 'All 1 school' : `All ${count} schools` },
          { label: 'Data Access', value: 'Complete System Data' },
        ],
      },
    ];
  }

  if (user.role === 'SCHOOL_ADMIN') {
    return [
      personalSection(user, config),
      {
        title: 'School Information',
        icon: 'school',
        fields: [
          { label: 'School Name', value: school?.name || NOT_ASSIGNED },
          { label: 'School Type', value: school?.schoolType || NOT_ASSIGNED },
          { label: 'District', value: school?.district || NOT_ASSIGNED },
          { label: 'Address', value: school?.address || NOT_PROVIDED },
        ],
      },
      accountSection(user, config, displayId),
      {
        title: 'Permissions & Access',
        icon: 'access',
        fields: [
          { label: 'Access Level', value: 'School Level Access' },
          { label: 'Modules Access', value: 'School Modules' },
          { label: 'Students Access', value: 'All Students in School' },
          { label: 'Data Access', value: 'School Data Only' },
        ],
      },
    ];
  }

  // TEACHER
  const teacher = user.teacher;
  const cls = teacher?.classTeacherOf;
  return [
    personalSection(user, config),
    {
      title: 'Professional Information',
      icon: 'professional',
      fields: [
        { label: 'Teacher ID', value: displayId },
        { label: 'Qualification', value: teacher?.qualification || NOT_PROVIDED },
        { label: 'Subjects', value: teacher?.subjects || NOT_PROVIDED },
        {
          label: 'Experience',
          value: teacher?.experienceYears != null ? `${teacher.experienceYears} years` : NOT_PROVIDED,
        },
      ],
    },
    {
      title: 'Class Information',
      icon: 'class',
      fields: [
        { label: 'Classes Teaching', value: cls ? `${cls.gradeLevel} - ${cls.className}` : NOT_ASSIGNED },
        { label: 'Academic Year', value: cls?.academicYear || NOT_ASSIGNED },
        { label: 'Total Students', value: cls ? `${cls._count.students} Students` : NOT_ASSIGNED },
        { label: 'Classroom', value: teacher?.classroom || NOT_PROVIDED },
      ],
    },
    accountSection(user, config, displayId),
  ];
}

function buildSummaryLine(user) {
  if (user.role === 'ADMIN') return 'Full system access • All schools • All modules';
  if (user.role === 'SCHOOL_ADMIN') {
    return user.school ? `Managing ${user.school.name}` : 'No school assigned';
  }
  return user.school?.name || 'No school assigned';
}

/**
 * Turns a database user into the exact UserProfile shape the web frontend expects.
 * `extras` carries values that need extra queries (e.g. { schoolCount }).
 */
export function buildProfile(user, extras = {}) {
  const config = ROLE_CONFIG[user.role];
  const displayId = `${config.idPrefix}-${user.id.slice(0, 8).toUpperCase()}`;
  const subjects = user.teacher?.subjects;

  return {
    id: displayId,
    fullName: user.fullName,
    roleTitle: user.role === 'TEACHER' && subjects ? `${subjects} Teacher` : config.roleTitle,
    roleBadge: config.roleBadge,
    summaryLine: buildSummaryLine(user),
    avatarInitial: user.fullName.charAt(0).toUpperCase(),
    quickStats: [
      { label: config.idLabel, value: displayId },
      { label: 'Email', value: user.email },
      { label: 'Phone', value: user.phone || NOT_PROVIDED },
      { label: 'Status', value: user.isActive ? 'Active' : 'Inactive', isStatus: true },
    ],
    sections: buildSections(user, config, displayId, extras),
    security: { passwordMasked: '••••••••', twoFactorEnabled: false },
    lastUpdated: formatDateTime(user.updatedAt),
  };
}
