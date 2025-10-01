import type { ReactNode } from 'react';
import authBg from '../assets/auth-bg.png';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen min-w-screen flex items-center bg-gray-50 relative">
      {/* Left background image */}
      <div
        className="absolute inset-0 left-0 w-2/3 pointer-events-none"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh',
        }}
      />
      {/* Responsive card positioning */}
      <div className="relative z-10 w-full max-w-md mx-auto md:ml-auto md:mr-16 p-6">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
