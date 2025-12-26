import React from 'react';
import { LOGO_URL } from '../constants';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <img 
            src={LOGO_URL} 
            alt="Pet Box Logo" 
            className={`${sizeClasses[size]} w-auto object-contain`} 
        />
      <h2 className={`font-bold leading-tight tracking-[-0.015em] ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
        Pet Box
      </h2>
    </div>
  );
};
