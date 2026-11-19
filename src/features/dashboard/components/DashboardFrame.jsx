import { useEffect } from 'react';
import { Button } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { paths } from '../../../routes/paths.js';
import { useDemoData } from '../hooks/useDemoData.js';
import { DashboardHeader } from './DashboardHeader.jsx';
import { DashboardNavigation } from './DashboardNavigation.jsx';
import { EmptyState } from './EmptyState.jsx';

export function DashboardFrame({ contextType }) {
  const { userId, orgId, cohortId, attemptId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data, viewerId, selectViewer, activeChatId, newChat, resetDemo } = useDemoData();
  const user = data.users.find((item) => item.id === userId);
  const organisation = data.organisations.find((item) => item.id === orgId);
  const isCohort = contextType === 'group' || contextType === 'class';
  const cohort = isCohort
    ? data.cohorts.find((item) => item.id === cohortId && item.kind === contextType)
    : null;
  const parentOrganisation =
    organisation || data.organisations.find((item) => item.id === cohort?.orgId);
  const attempt = data.attempts.find((item) => item.id === attemptId && item.userId === userId);
  const reportInCohort =
    !isCohort ||
    !attemptId ||
    data.tests.some(
      (test) =>
        test.id === attempt?.testId &&
        test.cohortId === cohort?.id &&
        test.cohortKind === cohort?.kind,
    );
  const valid =
    (!userId || Boolean(user)) &&
    (!orgId || Boolean(organisation)) &&
    (!isCohort || Boolean(cohort)) &&
    (!orgId || !isCohort || cohort?.orgId === orgId) &&
    (!isCohort || !userId || cohort?.studentIds.includes(userId)) &&
    reportInCohort;
  const viewer = data.users.find((item) => item.id === viewerId) || data.users[0];
  const basePath =
    contextType === 'admin'
      ? paths.admin
      : contextType === 'user'
        ? paths.user(userId)
        : contextType === 'org'
          ? paths.organisation(orgId)
          : `${orgId ? `${paths.organisation(orgId)}/` : '/'}${contextType}/${encodeURIComponent(cohortId)}`;
  const blankChatPath = contextType === 'user' ? basePath : paths.chat(basePath);
  const chatPath = activeChatId ? paths.chat(basePath, activeChatId) : blankChatPath;
  const isChat = pathname === blankChatPath || pathname.startsWith(`${basePath}/chat`);
  const contextName =
    contextType === 'admin'
      ? 'Platform administration'
      : contextType === 'user'
        ? 'My learning space'
        : contextType === 'org'
          ? organisation?.name
          : cohort?.name;

  useEffect(() => {
    if (contextType === 'user' && user && user.id !== viewerId) selectViewer(user.id);
  }, [contextType, user, viewerId, selectViewer]);

  const options =
    contextType === 'user'
      ? [
          ['Chat', chatPath, 'chat'],
          ['Revision Plan', paths.userRevisions(userId), 'calendar'],
          ['Test Reports', paths.userReports(userId), 'report'],
        ]
      : contextType === 'admin'
        ? [
            ['Group / Class list', basePath, 'grid'],
            ['Analytics', paths.adminAnalytics, 'chart'],
          ]
        : contextType === 'org'
          ? [['Groups & Classes', basePath, 'building']]
          : [
              ['Students / Users', basePath, 'users'],
              ['Invite User', paths.groupPage(basePath, 'invite'), 'plus'],
              ['Tests', paths.groupPage(basePath, 'tests'), 'report'],
              ['Student Progress', paths.groupPage(basePath, 'progress'), 'chart'],
            ];
  const navigation = options.map(([label, to, icon]) => ({
    label,
    to,
    icon,
    active:
      label === 'Chat'
        ? isChat
        : to === basePath
          ? pathname === basePath || pathname.startsWith(`${basePath}/students`)
          : pathname.startsWith(to),
  }));

  function handleNewChat() {
    const chat = newChat();
    navigate(paths.chat(basePath, chat.id));
  }

  function handleReset() {
    resetDemo();
    navigate(paths.user('1'));
  }

  return (
    <DashboardLayout
      navigation={
        <DashboardNavigation
          navigation={navigation}
          conversations={data.conversations.filter((chat) => chat.userId === viewerId)}
          viewer={viewer}
          basePath={basePath}
          onNewChat={handleNewChat}
          onReset={handleReset}
        />
      }
      header={
        <DashboardHeader
          contextType={contextType}
          contextName={contextName || 'Workspace not found'}
          organisation={isCohort ? parentOrganisation : null}
          viewerId={viewerId}
        />
      }
    >
      {valid ? (
        <Outlet key={basePath} context={{ cohort, organisation, user, basePath, contextType }} />
      ) : (
        <EmptyState
          title="Workspace not found"
          description="This sample workspace does not exist, or it does not belong to this organisation."
          action={
            <Button component={RouterLink} to={paths.admin}>
              Browse workspaces
            </Button>
          }
        />
      )}
    </DashboardLayout>
  );
}
