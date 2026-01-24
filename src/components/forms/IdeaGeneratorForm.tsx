'use client';

import { useState, useEffect } from 'react';
import { ClientSelector } from './ClientSelector';
import { PropertySelector } from './PropertySelector';
import { IdeaLaneSelector } from './IdeaLaneSelector';
import { NumberOfIdeasSelector } from './NumberOfIdeasSelector';
import { DocumentUploader } from './DocumentUploader';
import { Button } from '@/components/ui';
import type { Client, Property, IdeaLane, TechModifier, ContentStyle, ClientDocument } from '@/types/database';

interface IdeaGeneratorFormProps {
  clients: Client[];
  properties: Property[];
  onAddClient: (name: string) => Promise<Client>;
  onGenerate: (data: GenerateFormData) => Promise<void>;
  isGenerating: boolean;
}

export interface GenerateFormData {
  clientId: string;
  propertyIds: string[];
  ideaLane: IdeaLane;
  techModifiers: TechModifier[];
  contentStyle: ContentStyle | null;
  numIdeas: number;
  sessionFiles: File[];
}

export function IdeaGeneratorForm({
  clients,
  properties,
  onAddClient,
  onGenerate,
  isGenerating,
}: IdeaGeneratorFormProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedLane, setSelectedLane] = useState<IdeaLane | null>(null);
  const [techModifiers, setTechModifiers] = useState<TechModifier[]>([]);
  const [contentStyle, setContentStyle] = useState<ContentStyle | null>(null);
  const [numIdeas, setNumIdeas] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([]);
  const [sessionFiles, setSessionFiles] = useState<File[]>([]);

  // Fetch client documents when client changes
  useEffect(() => {
    if (selectedClientId) {
      fetch(`/api/clients/${selectedClientId}/documents`)
        .then((res) => res.json())
        .then((data) => setClientDocuments(data.documents || []))
        .catch(() => setClientDocuments([]));
    } else {
      setClientDocuments([]);
    }
  }, [selectedClientId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedClientId) {
      newErrors.client = 'Please select a client';
    }

    if (selectedPropertyIds.length === 0) {
      newErrors.properties = 'Please select at least one property';
    }

    if (!selectedLane) {
      newErrors.lane = 'Please select an idea lane';
    }

    if (selectedLane === 'content' && !contentStyle) {
      newErrors.contentStyle = 'Please select a content style';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onGenerate({
      clientId: selectedClientId!,
      propertyIds: selectedPropertyIds,
      ideaLane: selectedLane!,
      techModifiers,
      contentStyle,
      numIdeas,
      sessionFiles,
    });
  };

  const handleLaneChange = (lane: IdeaLane) => {
    setSelectedLane(lane);
    // Reset modifiers when changing lanes
    if (lane === 'content') {
      setTechModifiers([]);
    } else {
      setContentStyle(null);
    }
    // Clear lane-related errors
    setErrors((prev) => {
      const { lane: _l, contentStyle: _c, ...rest } = prev;
      return rest;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Selector */}
      <div>
        <ClientSelector
          clients={clients}
          selectedClientId={selectedClientId}
          onSelect={(id) => {
            setSelectedClientId(id);
            setErrors((prev) => {
              const { client: _, ...rest } = prev;
              return rest;
            });
          }}
          onAddClient={onAddClient}
        />
        {errors.client && (
          <p className="mt-1 text-sm text-error">{errors.client}</p>
        )}
      </div>

      {/* Property Selector */}
      <div>
        <PropertySelector
          properties={properties}
          selectedIds={selectedPropertyIds}
          onChange={(ids) => {
            setSelectedPropertyIds(ids);
            setErrors((prev) => {
              const { properties: _, ...rest } = prev;
              return rest;
            });
          }}
        />
        {errors.properties && (
          <p className="mt-1 text-sm text-error">{errors.properties}</p>
        )}
      </div>

      {/* Idea Lane Selector */}
      <div>
        <IdeaLaneSelector
          selectedLane={selectedLane}
          onLaneChange={handleLaneChange}
          techModifiers={techModifiers}
          onTechModifiersChange={setTechModifiers}
          contentStyle={contentStyle}
          onContentStyleChange={(style) => {
            setContentStyle(style);
            setErrors((prev) => {
              const { contentStyle: _, ...rest } = prev;
              return rest;
            });
          }}
        />
        {errors.lane && <p className="mt-1 text-sm text-error">{errors.lane}</p>}
        {errors.contentStyle && (
          <p className="mt-1 text-sm text-error">{errors.contentStyle}</p>
        )}
      </div>

      {/* Number of Ideas */}
      <NumberOfIdeasSelector value={numIdeas} onChange={setNumIdeas} />

      {/* Document Uploader */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reference Documents</h3>
        <DocumentUploader
          clientId={selectedClientId}
          clientDocuments={clientDocuments}
          onDocumentsChange={setClientDocuments}
          sessionFiles={sessionFiles}
          onSessionFilesChange={setSessionFiles}
        />
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          isLoading={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating Ideas...' : 'Generate Ideas'}
        </Button>
      </div>
    </form>
  );
}
