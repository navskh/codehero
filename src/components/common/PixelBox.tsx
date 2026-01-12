import type { ReactNode } from 'react';

interface IPixelBoxProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'glow';
}

export function PixelBox({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default'
}: IPixelBoxProps) {
  const variantClasses = {
    default: 'glass-card',
    gradient: 'glass-card bg-gradient-to-br from-[rgba(0,212,255,0.1)] to-[rgba(168,85,247,0.1)]',
    glow: 'glass-card shadow-[0_0_30px_rgba(0,212,255,0.2)]',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${hover ? 'cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
