import { createClient } from '@/lib/supabase/server';
import { getIdeaSessionById, getIdeasBySession, getClientById, getPropertiesByIds } from '@/lib/supabase/db';
import { notFound } from 'next/navigation';
import { SessionDetailClient } from './SessionDetailClient';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const session = await getIdeaSessionById(supabase, sessionId);
  if (!session) {
    notFound();
  }

  const [ideas, client, properties] = await Promise.all([
    getIdeasBySession(supabase, sessionId),
    getClientById(supabase, session.client_id),
    getPropertiesByIds(supabase, session.property_ids),
  ]);

  if (!client) {
    notFound();
  }

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
            <a href="/history" className="text-muted hover:text-foreground transition-colors">
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <SessionDetailClient
            session={session}
            ideas={ideas}
            client={client}
            properties={properties}
          />
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
