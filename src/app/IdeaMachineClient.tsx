'use client';

import { useState, useEffect } from 'react';
import { IdeaGeneratorForm, IdeasDisplay, LoadingSpinner } from '@/components';
import type { GenerateFormData } from '@/components/forms';
import type { Client, Property, Idea } from '@/types/database';

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

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, propertiesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/properties'),
        ]);

        if (!clientsRes.ok || !propertiesRes.ok) {
          throw new Error('Failed to load data');
        }

        const clientsData = await clientsRes.json();
        const propertiesData = await propertiesRes.json();

        setClients(clientsData.clients);
        setProperties(propertiesData.properties);
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddClient = async (name: string, domain?: string): Promise<Client> => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, domain: domain || null }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create client');
    }

    const newClient = await res.json();
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
      if (data.sessionName) {
        formData.append('session_name', data.sessionName);
      }
      formData.append('property_ids', JSON.stringify(data.propertyIds));
      formData.append('idea_lane', data.ideaLane);
      if (data.techModifiers.length > 0) {
        formData.append('tech_modifiers', JSON.stringify(data.techModifiers));
      }
      if (data.audienceModifier) {
        formData.append('audience_modifier', data.audienceModifier);
      }
      if (data.platformModifier) {
        formData.append('platform_modifier', data.platformModifier);
      }
      if (data.budgetTier) {
        formData.append('budget_tier', data.budgetTier);
      }
      if (data.talentNames && data.talentNames.length > 0) {
        formData.append('talent_names', JSON.stringify(data.talentNames));
      }
      formData.append('num_ideas', data.numIdeas.toString());
      if (data.outputStyle) {
        formData.append('output_style', JSON.stringify(data.outputStyle));
      }
      formData.append('model', data.model);

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

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setGeneratedIdeas((prev) =>
      prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
    );
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
          onUpdateIdea={handleUpdateIdea}
        />
      ) : (
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
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
