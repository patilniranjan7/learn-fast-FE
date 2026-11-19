import { useNavigate, useOutletContext } from 'react-router';
import { OrganisationPage } from './OrganisationPage.jsx';
import { StudentsPage } from './StudentsPage.jsx';
import { GroupTestsPage } from './GroupTestsPage.jsx';
import { ProgressPage } from './ProgressPage.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { InviteDialog } from '../components/InviteDialog.jsx';
import { useDemoData } from '../hooks/useDemoData.js';

export function OrganisationOverviewPage() {
  const { organisation } = useOutletContext();
  return <OrganisationPage organisation={organisation} />;
}

export function CohortStudentsPage() {
  const context = useOutletContext();
  return <StudentsPage {...context} />;
}

export function CohortTestsPage() {
  const context = useOutletContext();
  return <GroupTestsPage {...context} />;
}

export function CohortProgressPage() {
  const context = useOutletContext();
  return <ProgressPage {...context} />;
}

export function CohortInvitePage() {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { data, addInvitation } = useDemoData();

  return (
    <>
      <StudentsPage {...context} />
      <InviteDialog
        open
        cohort={context.cohort}
        data={data}
        onClose={() => navigate(context.basePath)}
        onInvite={(values) => {
          addInvitation(values);
          navigate(context.basePath);
        }}
      />
    </>
  );
}

export function MissingDashboardPage() {
  return (
    <EmptyState
      title="Page not found"
      description="Choose a page from the drawer to return to this workspace."
    />
  );
}
