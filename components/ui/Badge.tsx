
import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/20 text-violet-300 ring-1 ring-inset ring-primary/30',
    gray: 'bg-gray-700/50 text-gray-300 ring-1 ring-inset ring-gray-600'
  };
  
  const className = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
};

export default Badge;