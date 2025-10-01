import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
