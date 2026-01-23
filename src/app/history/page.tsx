import { createClient } from '@/lib/supabase/server';
import { getIdeaSessions } from '@/lib/supabase/db';
import { HistoryClient } from './HistoryClient';

export default async function HistoryPage() {
  const supabase = await createClient();
  const sessions = await getIdeaSessions(supabase);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            <span className="text-accent">Idea</span> Machine
          </a>
          <nav className="flex gap-4">
            <a href="/settings" className="text-muted hover:text-foreground transition-colors">
              Settings
            </a>
            <a href="/history" className="text-accent font-medium">
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Session History</h1>
            <p className="text-muted">
              View and revisit your past ideation sessions
            </p>
          </div>

          <HistoryClient sessions={sessions} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-muted text-sm">
          Idea Machine - Internal Ideation Tool
        </div>
      </footer>
    </div>
  );
}
