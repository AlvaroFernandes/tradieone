import type { ReactNode } from 'react';
import logo from '../assets/logo.png';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#1a9aaa] via-[#eab308] to-[#f97316]">
      {/* Top-left logo + phrase */}
      <div className="absolute top-10 left-10 z-10">
        <img src={logo} alt="TradieOne" className="h-12 object-contain mb-3" />
        <p className="text-lg text-white opacity-90">
          All-in-one solution for job management
        </p>
      </div>
      {/* Left background image */}

      {/* Responsive card positioning */}
        {children}

    </div>
  );
};

export default AuthLayout;
