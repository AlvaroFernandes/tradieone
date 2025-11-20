import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import RequireAuth from './RequireAuth';
import { ProjectsPage } from '../pages/ProjectsPage';
import ProjectPage from '../pages/ProjectPage';
import JobsPage from '../pages/JobsPage';
import ClientsPage from '../pages/ClientsPage';
import EmployeesPage from '../pages/EmployeesPage';
import ContractorsPage from '../pages/ContractorsPage';
import TimesheetsPage from '../pages/TimesheetsPage';
import DashboardLayout from '../layouts/DashboardLayout';
import UserProfilePage from '../pages/UserProfile';

const routes = [
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/projects',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <ProjectsPageWrapper />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/project/:projectId',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <ProjectPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/jobs',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <JobsPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/clients',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <ClientsPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/employees',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <EmployeesPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/contractors',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <ContractorsPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/timesheets',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <TimesheetsPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard/profile',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <UserProfilePage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

// Wrapper component for ProjectsPage to handle navigation
function ProjectsPageWrapper() {
  const navigate = useNavigate();
  
  const handleViewProject = (project: { id: number; name: string; client: string; status: string; startDate: string; endDate: string; location: string; teamSize: number; jobsCount: number }) => {
    navigate(`/dashboard/project/${project.id}`);
  };

  return (
    <div className="p-6">
      <ProjectsPage onViewProject={handleViewProject} />
    </div>
  );
}

export default function AppRoutes() {
  return useRoutes(routes);
}
