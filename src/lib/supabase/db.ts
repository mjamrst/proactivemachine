// Database helper functions for Idea Machine

import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Client,
  ClientInsert,
  Property,
  PropertyWithParent,
  IdeaSession,
  IdeaSessionWithDetails,
  IdeaSessionInsert,
  Idea,
  IdeaInsert,
  PropertiesByCategory,
  ClientDocument,
  SessionDocument,
} from '@/types/database';

// ============================================
// CLIENTS
// ============================================

export async function getClients(supabase: SupabaseClient): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getClientById(
  supabase: SupabaseClient,
  id: string
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createClient(
  supabase: SupabaseClient,
  client: ClientInsert
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// PROPERTIES
// ============================================

export async function getProperties(
  supabase: SupabaseClient
): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getPropertiesWithParents(
  supabase: SupabaseClient
): Promise<PropertyWithParent[]> {
  const { data, error } = await supabase
    .from('properties_with_parents')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getPropertiesByCategory(
  supabase: SupabaseClient
): Promise<PropertiesByCategory> {
  const properties = await getProperties(supabase);

  return {
    leagues: properties.filter((p) => p.category === 'league'),
    teams: properties.filter((p) => p.category === 'team'),
    music_festivals: properties.filter((p) => p.category === 'music_festival'),
    entertainment: properties.filter((p) => p.category === 'entertainment'),
    cultural_moments: properties.filter((p) => p.category === 'cultural_moment'),
  };
}

export async function getPropertiesByIds(
  supabase: SupabaseClient,
  ids: string[]
): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  return data;
}

export async function getTeamsByLeague(
  supabase: SupabaseClient,
  leagueId: string
): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('parent_id', leagueId)
    .eq('category', 'team')
    .order('name');

  if (error) throw error;
  return data;
}

// ============================================
// IDEA SESSIONS
// ============================================

export async function getIdeaSessions(
  supabase: SupabaseClient
): Promise<IdeaSessionWithDetails[]> {
  const { data, error } = await supabase
    .from('idea_sessions_with_details')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getIdeaSessionById(
  supabase: SupabaseClient,
  id: string
): Promise<IdeaSession | null> {
  const { data, error } = await supabase
    .from('idea_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createIdeaSession(
  supabase: SupabaseClient,
  session: IdeaSessionInsert
): Promise<IdeaSession> {
  const { data, error } = await supabase
    .from('idea_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// IDEAS
// ============================================

export async function getIdeasBySession(
  supabase: SupabaseClient,
  sessionId: string
): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function createIdea(
  supabase: SupabaseClient,
  idea: IdeaInsert
): Promise<Idea> {
  const { data, error } = await supabase
    .from('ideas')
    .insert(idea)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createIdeas(
  supabase: SupabaseClient,
  ideas: IdeaInsert[]
): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .insert(ideas)
    .select();

  if (error) throw error;
  return data;
}

export async function updateIdeaFigmaFrameId(
  supabase: SupabaseClient,
  ideaId: string,
  figmaFrameId: string
): Promise<void> {
  const { error } = await supabase
    .from('ideas')
    .update({ figma_frame_id: figmaFrameId })
    .eq('id', ideaId);

  if (error) throw error;
}

// ============================================
// CLIENT DOCUMENTS
// ============================================

export async function getClientDocuments(
  supabase: SupabaseClient,
  clientId: string
): Promise<ClientDocument[]> {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createClientDocument(
  supabase: SupabaseClient,
  document: Omit<ClientDocument, 'id' | 'created_at'>
): Promise<ClientDocument> {
  const { data, error } = await supabase
    .from('client_documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClientDocument(
  supabase: SupabaseClient,
  documentId: string
): Promise<void> {
  const { error } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', documentId);

  if (error) throw error;
}

// ============================================
// SESSION DOCUMENTS
// ============================================

export async function getSessionDocuments(
  supabase: SupabaseClient,
  sessionId: string
): Promise<SessionDocument[]> {
  const { data, error } = await supabase
    .from('session_documents')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createSessionDocument(
  supabase: SupabaseClient,
  document: Omit<SessionDocument, 'id' | 'created_at'>
): Promise<SessionDocument> {
  const { data, error } = await supabase
    .from('session_documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data;
}
