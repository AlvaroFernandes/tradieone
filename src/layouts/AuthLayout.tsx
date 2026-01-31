import type { ReactNode } from 'react';
import logo from "../assets/logo.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-[#1a9aaa] via-[#eab308] to-[#f97316]">
      {/* Top-left logo + phrase */}
      <div className="hidden md:flex absolute top-10 left-10 z-10 w-80 flex-col items-center">
        {/* make the container width dictated by the text below, then make the logo fill that width */}
        <img src={logo} alt="TradieOne" className="w-full h-auto object-contain mb-3" />
        <p className="text-lg text-white opacity-90 block">
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
