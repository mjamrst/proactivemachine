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

const sizePx = {
  sm: 20,
  md: 32,
  lg: 40,
};

export function ClientLogo({ domain, name, size = 'md', className = '' }: ClientLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Try multiple logo sources in order of quality
  const logoSources = domain
    ? [
        // Google's high-res favicon service
        `https://www.google.com/s2/favicons?domain=${domain}&sz=${sizePx[size] * 2}`,
        // DuckDuckGo icons
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
        // Direct favicon from site
        `https://${domain}/favicon.ico`,
      ]
    : [];

  const currentLogo = logoSources[sourceIndex];

  const handleError = () => {
    if (sourceIndex < logoSources.length - 1) {
      setSourceIndex(sourceIndex + 1);
    } else {
      setSourceIndex(-1); // All sources failed, show initials
    }
  };

  if (!domain || sourceIndex === -1 || logoSources.length === 0) {
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
      src={currentLogo}
      alt={`${name} logo`}
      className={`${sizeClasses[size]} ${className} rounded-md object-contain bg-white p-0.5 flex-shrink-0`}
      onError={handleError}
    />
  );
}
