import React from 'react';

interface CloudIconProps {
  provider: 'aws' | 'azure' | 'gcp' | 'all';
  className?: string;
  size?: number;
}

export const CloudIcon: React.FC<CloudIconProps> = ({ provider, className = 'w-4 h-4', size = 16 }) => {
  if (provider === 'aws') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`text-amber-400 ${className}`}
        aria-label="Amazon Web Services"
      >
        <path d="M12.012 3C6.732 3 2.378 6.84 1.558 11.898l2.946.502C5.076 8.358 8.214 5.5 12.012 5.5c4.78 0 8.688 3.908 8.688 8.688 0 2.214-.836 4.24-2.215 5.772l1.83 1.83A11.127 11.127 0 0 0 23.2 14.188C23.2 7.994 18.206 3 12.012 3zM6.9 14.4c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5-4.5-2.015-4.5-4.5zm2.5 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2z" />
        <path d="M2.5 19.5h10v2h-10z" />
      </svg>
    );
  }

  if (provider === 'azure') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`text-blue-400 ${className}`}
        aria-label="Microsoft Azure"
      >
        <path d="M13.05 3.5 6.2 15.65h5.4L6 20.5l11.8-12.2h-5.45l4.65-4.8H13.05z" />
      </svg>
    );
  }

  if (provider === 'gcp') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`text-rose-400 ${className}`}
        aria-label="Google Cloud Platform"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`text-emerald-400 ${className}`}
      aria-label="Multi-Cloud"
    >
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
};
