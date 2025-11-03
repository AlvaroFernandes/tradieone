import { Navigate, useRoutes } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import RequireAuth from './RequireAuth';

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
    path: '*',
    element: <NotFound />,
  },
];

export default function AppRoutes() {
  return useRoutes(routes);
}
