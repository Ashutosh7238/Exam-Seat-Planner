export const APP_NAME = 'ExamSeat Planner';

export const ROUTES = {
  DASHBOARD: '/',
  ADD_CLASSROOM: '/add-classroom',
  CLASSROOMS: '/classrooms',
  ALLOCATE: '/allocate',
};

export const NAV_LINKS = [
  { path: ROUTES.DASHBOARD,     label: 'Dashboard',        icon: '🏠' },
  { path: ROUTES.ADD_CLASSROOM, label: 'Add Classroom',    icon: '➕' },
  { path: ROUTES.CLASSROOMS,    label: 'View Classrooms',  icon: '📋' },
  { path: ROUTES.ALLOCATE,      label: 'Allocate Exam',    icon: '🎯' },
];

export const COLORS = {
  primary:    '#e94560',
  secondary:  '#0f3460',
  bg:         '#0a0f1e',
  surface:    '#16213e',
  surfaceAlt: '#1a2744',
  border:     '#0f3460',
  textPrimary:'#e2e8f0',
  textMuted:  '#a8b2d8',
  textFaint:  '#64748b',
  green:      '#4ade80',
  amber:      '#fbbf24',
  blue:       '#60a5fa',
  indigo:     '#818cf8',
};
