'use client';

import { useState, useEffect } from 'react';
import { IdeaGeneratorForm, IdeasDisplay, LoadingSpinner } from '@/components';
import type { GenerateFormData } from '@/components/forms';
import type { Client, Property, Idea } from '@/types/database';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { getClients, getProperties, createClient } from '@/lib/supabase/db';

export function IdeaMachineClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient();

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsData, propertiesData] = await Promise.all([
          getClients(supabase),
          getProperties(supabase),
        ]);
        setClients(clientsData);
        setProperties(propertiesData);
      } catch (err) {
        setError('Failed to load data. Please check your Supabase connection.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddClient = async (name: string, domain?: string): Promise<Client> => {
    const newClient = await createClient(supabase, { name, domain: domain || null });
    setClients((prev) => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)));
    return newClient;
  };

  const handleGenerate = async (data: GenerateFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use FormData to support file uploads
      const formData = new FormData();
      formData.append('client_id', data.clientId);
      formData.append('property_ids', JSON.stringify(data.propertyIds));
      formData.append('idea_lane', data.ideaLane);
      if (data.techModifiers.length > 0) {
        formData.append('tech_modifiers', JSON.stringify(data.techModifiers));
      }
      if (data.contentStyle) {
        formData.append('content_style', data.contentStyle);
      }
      formData.append('num_ideas', data.numIdeas.toString());

      // Append session files
      data.sessionFiles.forEach((file, index) => {
        formData.append(`session_file_${index}`, file);
      });
      formData.append('session_file_count', data.sessionFiles.length.toString());

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate ideas');
      }

      const result = await response.json();
      setGeneratedIdeas(result.ideas);
      setSessionId(result.session_id);
      setSelectedClient(clients.find((c) => c.id === data.clientId) || null);
      setSelectedProperties(
        properties.filter((p) => data.propertyIds.includes(p.id))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedIdeas([]);
    setSessionId(null);
    setSelectedClient(null);
    setSelectedProperties([]);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  if (error && clients.length === 0) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
        <p className="text-error">{error}</p>
        <p className="text-muted text-sm mt-2">
          Please ensure your Supabase database is set up correctly and the
          environment variables are configured.
        </p>
      </div>
    );
  }

  return (
    <div>
      {generatedIdeas.length > 0 ? (
        <IdeasDisplay
          ideas={generatedIdeas}
          client={selectedClient}
          properties={selectedProperties}
          sessionId={sessionId}
          onReset={handleReset}
        />
      ) : (
        <div className="bg-card-bg border border-card-border rounded-xl p-8 max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <IdeaGeneratorForm
            clients={clients}
            properties={properties}
            onAddClient={handleAddClient}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      )}
    </div>
  );
}
