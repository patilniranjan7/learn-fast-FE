export const users = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    initials: 'AS',
    color: 'primary.main',
    studentLabel: 'Class 12 · Science',
  },
  {
    id: '2',
    name: 'Ananya Rao',
    email: 'ananya@example.com',
    initials: 'AR',
    color: 'info.main',
    studentLabel: 'Class 12 · Science',
  },
  {
    id: '3',
    name: 'Kabir Mehta',
    email: 'kabir@example.com',
    initials: 'KM',
    color: 'warning.main',
    studentLabel: 'Class 11 · Science',
  },
  {
    id: '4',
    name: 'Diya Patel',
    email: 'diya@example.com',
    initials: 'DP',
    color: 'secondary.main',
    studentLabel: 'Independent learner',
  },
];

export const organisations = [
  {
    id: '1',
    name: 'Northstar Academy',
    description: 'A little curiosity. A world of possibilities.',
  },
  { id: '2', name: 'Oakwood Learning', description: 'Growing confident, independent learners.' },
];

export const cohorts = [
  {
    id: '1',
    kind: 'class',
    name: 'Class 12 · Science',
    orgId: '1',
    studentIds: ['1', '2', '3'],
    description: 'Physics, chemistry, and a fresh perspective.',
  },
  {
    id: '1',
    kind: 'group',
    name: 'Physics Circle',
    orgId: null,
    studentIds: ['1', '3'],
    description: 'A small group for big questions about the universe.',
  },
  {
    id: '2',
    kind: 'group',
    name: 'JEE Study Club',
    orgId: '1',
    studentIds: ['1', '2'],
    description: 'Practice together. Understand a little more every day.',
  },
  {
    id: '2',
    kind: 'class',
    name: 'Class 11 · Foundations',
    orgId: '2',
    studentIds: ['3', '4'],
    description: 'Building strong foundations, one concept at a time.',
  },
];
