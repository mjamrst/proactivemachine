import { createClient } from '@/lib/supabase/server';
import { getIdeaSessionById, getIdeasBySession, getClientById, getPropertiesByIds } from '@/lib/supabase/db';
import { notFound } from 'next/navigation';
import { PresentationView } from './PresentationView';
import './presentation.css';

interface PageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ theme?: string }>;
}

export default async function PresentationPage({ params, searchParams }: PageProps) {
  const { sessionId } = await params;
  const { theme } = await searchParams;
  const presentationTheme = theme === 'light' ? 'light' : 'dark';
  const supabase = await createClient();

  // Fetch session data
  const session = await getIdeaSessionById(supabase, sessionId);
  if (!session) {
    notFound();
  }

  // Fetch related data
  const [ideas, client, properties] = await Promise.all([
    getIdeasBySession(supabase, sessionId),
    getClientById(supabase, session.client_id),
    getPropertiesByIds(supabase, session.property_ids),
  ]);

  if (!client || ideas.length === 0) {
    notFound();
  }

  return (
    <PresentationView
      ideas={ideas}
      client={client}
      properties={properties}
      session={session}
      theme={presentationTheme}
    />
  );
}
