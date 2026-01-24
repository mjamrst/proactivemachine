'use client';

import { useState, useEffect } from 'react';
import { ClientSelector } from './ClientSelector';
import { PropertySelector } from './PropertySelector';
import { IdeaLaneSelector } from './IdeaLaneSelector';
import { NumberOfIdeasSelector } from './NumberOfIdeasSelector';
import { OutputStyleSelector } from './OutputStyleSelector';
import { DocumentUploader } from './DocumentUploader';
import { Button } from '@/components/ui';
import type { Client, Property, IdeaLane, TechModifier, AudienceModifier, PlatformModifier, BudgetTier, ClientDocument, OutputStyle } from '@/types/database';

interface IdeaGeneratorFormProps {
  clients: Client[];
  properties: Property[];
  onAddClient: (name: string) => Promise<Client>;
  onGenerate: (data: GenerateFormData) => Promise<void>;
  isGenerating: boolean;
}

export interface GenerateFormData {
  clientId: string;
  sessionName: string;
  propertyIds: string[];
  ideaLane: IdeaLane;
  techModifiers: TechModifier[];
  audienceModifier: AudienceModifier | null;
  platformModifier: PlatformModifier | null;
  budgetTier: BudgetTier | null;
  numIdeas: number;
  outputStyle: OutputStyle | null;
  sessionFiles: File[];
}

// Reusable section wrapper component
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function IdeaGeneratorForm({
  clients,
  properties,
  onAddClient,
  onGenerate,
  isGenerating,
}: IdeaGeneratorFormProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string>('');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedLane, setSelectedLane] = useState<IdeaLane | null>(null);
  const [techModifiers, setTechModifiers] = useState<TechModifier[]>([]);
  const [audienceModifier, setAudienceModifier] = useState<AudienceModifier | null>(null);
  const [platformModifier, setPlatformModifier] = useState<PlatformModifier | null>(null);
  const [budgetTier, setBudgetTier] = useState<BudgetTier | null>(null);
  const [numIdeas, setNumIdeas] = useState(5);
  const [outputStyle, setOutputStyle] = useState<OutputStyle | null>(null);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onGenerate({
      clientId: selectedClientId!,
      sessionName: sessionName.trim(),
      propertyIds: selectedPropertyIds,
      ideaLane: selectedLane!,
      techModifiers,
      audienceModifier,
      platformModifier,
      budgetTier,
      numIdeas,
      outputStyle,
      sessionFiles,
    });
  };

  const handleLaneChange = (lane: IdeaLane) => {
    setSelectedLane(lane);
    // Reset tech modifiers when switching to content lane (no tech modifiers for content)
    if (lane === 'content') {
      setTechModifiers([]);
    }
    // Clear lane-related errors
    setErrors((prev) => {
      const { lane: _l, ...rest } = prev;
      return rest;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Selector */}
      <Section>
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
          <p className="mt-2 text-sm text-error">{errors.client}</p>
        )}
      </Section>

      {/* Session Name */}
      <Section>
        <label className="block text-sm font-medium text-foreground mb-2">
          Session Name <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="e.g., Q1 Campaign Ideas, Product Launch Concepts..."
          className="w-full px-4 py-3 bg-[#f7f7f5] border border-gray-200 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <p className="mt-2 text-xs text-muted">
          Give this session a name to easily find it later in your history
        </p>
      </Section>

      {/* Property Selector */}
      <Section>
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
          <p className="mt-2 text-sm text-error">{errors.properties}</p>
        )}
      </Section>

      {/* Idea Lane Selector */}
      <Section>
        <IdeaLaneSelector
          selectedLane={selectedLane}
          onLaneChange={handleLaneChange}
          techModifiers={techModifiers}
          onTechModifiersChange={setTechModifiers}
          audienceModifier={audienceModifier}
          onAudienceModifierChange={setAudienceModifier}
          platformModifier={platformModifier}
          onPlatformModifierChange={setPlatformModifier}
          budgetTier={budgetTier}
          onBudgetTierChange={setBudgetTier}
        />
        {errors.lane && <p className="mt-2 text-sm text-error">{errors.lane}</p>}
      </Section>

      {/* Number of Ideas */}
      <Section>
        <NumberOfIdeasSelector value={numIdeas} onChange={setNumIdeas} />
      </Section>

      {/* Output Style */}
      <Section>
        <OutputStyleSelector value={outputStyle} onChange={setOutputStyle} />
      </Section>

      {/* Document Uploader */}
      <Section>
        <h3 className="text-lg font-semibold mb-4">Reference Documents</h3>
        <DocumentUploader
          clientId={selectedClientId}
          clientDocuments={clientDocuments}
          onDocumentsChange={setClientDocuments}
          sessionFiles={sessionFiles}
          onSessionFilesChange={setSessionFiles}
        />
      </Section>

      {/* Generate Button */}
      <div className="pt-2">
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
