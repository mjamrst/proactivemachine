import { createClient } from '@/lib/supabase/server';
import { getIdeaSessions } from '@/lib/supabase/db';
import { getAuthUser } from '@/lib/auth';
import { HistoryClient } from './HistoryClient';
import { Header } from '@/components/Header';

export default async function HistoryPage() {
  const supabase = await createClient();
  const user = await getAuthUser();

  // Admins see all sessions, regular users only see their own
  const userId = user?.role === 'admin' ? undefined : user?.id;
  const sessions = await getIdeaSessions(supabase, userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="history" />

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
