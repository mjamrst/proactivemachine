'use client';

import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  currentPage?: 'home' | 'settings' | 'history';
}

export function Header({ currentPage }: HeaderProps) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="border-b border-card-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src="/primer-logo.png"
            alt="Primer"
            className="h-12 w-auto"
          />
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
            {isAdmin && (
              <a
                href="/admin"
                className="text-muted hover:text-foreground transition-colors"
              >
                Admin
              </a>
            )}
          </nav>
          <div className="flex items-center gap-3 pl-3 border-l border-card-border">
            {user && (
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
                    {user.display_name[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-muted hidden sm:inline">
                  {user.display_name}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-muted hover:text-error transition-colors ml-2"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
