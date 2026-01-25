import { createClient } from '@/lib/supabase/server';
import { getIdeaSessionById, getIdeasBySession, getClientById, getPropertiesByIds } from '@/lib/supabase/db';
import { notFound } from 'next/navigation';
import { SessionDetailClient } from './SessionDetailClient';
import { Header } from '@/components/Header';

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
      <Header />

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
          Primer - AI-Powered Activation Ideas
        </div>
      </footer>
    </div>
  );
}
