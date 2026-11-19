export const paths = {
  home: '/',
  login: '/login',
  signup: '/signup',
  admin: '/admin',
  adminAnalytics: '/admin/analytics',
  user: (id) => `/user/${encodeURIComponent(id)}`,
  userRevisions: (id) => `${paths.user(id)}/revisions`,
  userReports: (id) => `${paths.user(id)}/tests`,
  userReport: (userId, attemptId) =>
    `${paths.userReports(userId)}/${encodeURIComponent(attemptId)}`,
  organisation: (id) => `/org/${encodeURIComponent(id)}`,
  cohort: ({ id, kind, orgId }) =>
    `${orgId ? `${paths.organisation(orgId)}/` : '/'}${kind}/${encodeURIComponent(id)}`,
  groupPage: (basePath, page) => `${basePath}/${page}`,
  cohortReport: (basePath, userId, attemptId) =>
    `${basePath}/students/${encodeURIComponent(userId)}/reports/${encodeURIComponent(attemptId)}`,
  chat: (basePath, id) => `${basePath}/chat${id ? `/${encodeURIComponent(id)}` : ''}`,
};
