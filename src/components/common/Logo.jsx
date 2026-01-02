import React from 'react';
import logoUrl from '../../assets/logo.svg';

export function Logo({ className = "w-6 h-6", iconOnly = false }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img src={logoUrl} alt="FinEye Logo" className="w-full h-full object-contain" />
    </div>
  );
}
