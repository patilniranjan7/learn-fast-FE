import { Navigate, Route, Routes } from 'react-router';
import { LoginPage, SignupPage } from '../features/auth/index.js';
import {
  DashboardProvider,
  DashboardFrame,
  ChatPage,
  RevisionsPage,
  ReportsPage,
  ReportDetailPage,
  AdminDirectoryPage,
  AnalyticsPage,
  OrganisationOverviewPage,
  CohortStudentsPage,
  CohortTestsPage,
  CohortProgressPage,
  CohortInvitePage,
  MissingDashboardPage,
} from '../features/dashboard/index.js';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { LegacyAuthRedirect } from './LegacyAuthRedirect.jsx';
import { NotFoundPage } from './NotFoundPage.jsx';
import { paths } from './paths.js';

function chatRoutes() {
  return (
    <>
      <Route path="chat" element={<ChatPage />} />
      <Route path="chat/:chatId" element={<ChatPage />} />
    </>
  );
}

function cohortRoute(path, contextType) {
  return (
    <Route key={path} path={path} element={<DashboardFrame contextType={contextType} />}>
      <Route index element={<CohortStudentsPage />} />
      <Route path="students" element={<CohortStudentsPage />} />
      <Route path="invite" element={<CohortInvitePage />} />
      <Route path="students/:userId/reports/:attemptId" element={<ReportDetailPage />} />
      <Route path="tests" element={<CohortTestsPage />} />
      <Route path="progress" element={<CohortProgressPage />} />
      {chatRoutes()}
      <Route path="*" element={<MissingDashboardPage />} />
    </Route>
  );
}

export function AppRoutes() {
  return (
    <DashboardProvider>
      <LegacyAuthRedirect>
        <Routes>
          <Route path={paths.home} element={<Navigate to={paths.login} replace />} />
          <Route element={<AuthLayout homePath={paths.home} />}>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.signup} element={<SignupPage />} />
          </Route>
          <Route path="/user" element={<Navigate to={paths.user('1')} replace />} />
          <Route path="/org" element={<Navigate to={paths.organisation('1')} replace />} />
          <Route path="/group" element={<Navigate to="/group/1" replace />} />
          <Route path="/class" element={<Navigate to="/class/1" replace />} />
          <Route path="/user/:userId" element={<DashboardFrame contextType="user" />}>
            <Route index element={<ChatPage />} />
            {chatRoutes()}
            <Route path="revisions" element={<RevisionsPage />} />
            <Route path="tests" element={<ReportsPage />} />
            <Route path="tests/:attemptId" element={<ReportDetailPage />} />
            <Route path="*" element={<MissingDashboardPage />} />
          </Route>
          <Route path="/admin" element={<DashboardFrame contextType="admin" />}>
            <Route index element={<AdminDirectoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            {chatRoutes()}
            <Route path="*" element={<MissingDashboardPage />} />
          </Route>
          <Route path="/org/:orgId" element={<DashboardFrame contextType="org" />}>
            <Route index element={<OrganisationOverviewPage />} />
            {chatRoutes()}
            <Route path="*" element={<MissingDashboardPage />} />
          </Route>
          {cohortRoute('/group/:cohortId', 'group')}
          {cohortRoute('/class/:cohortId', 'class')}
          {cohortRoute('/org/:orgId/group/:cohortId', 'group')}
          {cohortRoute('/org/:orgId/class/:cohortId', 'class')}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LegacyAuthRedirect>
    </DashboardProvider>
  );
}
