'use client';

import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPage?: 'home' | 'settings' | 'history';
}

export function Header({ currentPage }: HeaderProps) {
  return (
    <header className="border-b border-card-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">
          <span className="text-accent">Idea</span> Machine
        </a>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <a
              href="/settings"
              className={`transition-colors ${
                currentPage === 'settings'
                  ? 'text-accent font-medium'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Settings
            </a>
            <a
              href="/history"
              className={`transition-colors ${
                currentPage === 'history'
                  ? 'text-accent font-medium'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              History
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
