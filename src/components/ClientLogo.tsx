'use client';

import { useState } from 'react';

interface ClientLogoProps {
  domain: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export function ClientLogo({ domain, name, size = 'md', className = '' }: ClientLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use logo.dev API for high-quality logos
  const apiToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const logoUrl = domain && apiToken
    ? `https://img.logo.dev/${domain}?token=${apiToken}&size=128&format=png`
    : null;

  if (!logoUrl || hasError) {
    // Fallback to initials
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-md bg-accent/20 flex items-center justify-center text-accent font-semibold flex-shrink-0`}
        style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px' }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`${sizeClasses[size]} ${className} rounded-md object-contain bg-white p-0.5 flex-shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}
