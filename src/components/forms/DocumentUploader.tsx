'use client';

import { useState, useRef } from 'react';
import type { ClientDocument } from '@/types/database';

interface DocumentUploaderProps {
  clientId: string | null;
  clientDocuments: ClientDocument[];
  onDocumentsChange: (docs: ClientDocument[]) => void;
  sessionFiles: File[];
  onSessionFilesChange: (files: File[]) => void;
}

export function DocumentUploader({
  clientId,
  clientDocuments,
  onDocumentsChange,
  sessionFiles,
  onSessionFilesChange,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientFileRef = useRef<HTMLInputElement>(null);
  const sessionFileRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleClientDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clientId) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`/api/clients/${clientId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      onDocumentsChange([...clientDocuments, data.document]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (clientFileRef.current) clientFileRef.current.value = '';
    }
  };

  const handleDeleteClientDocument = async (doc: ClientDocument) => {
    if (!clientId) return;

    try {
      const response = await fetch(
        `/api/clients/${clientId}/documents?documentId=${doc.id}&fileUrl=${encodeURIComponent(doc.file_url)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      onDocumentsChange(clientDocuments.filter((d) => d.id !== doc.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSessionFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['pdf', 'docx', 'doc', 'txt'].includes(ext || '');
    });

    onSessionFilesChange([...sessionFiles, ...newFiles]);
    if (sessionFileRef.current) sessionFileRef.current.value = '';
  };

  const handleRemoveSessionFile = (index: number) => {
    onSessionFilesChange(sessionFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Client Documents Section */}
      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground">Brand Documents</h4>
            <p className="text-sm text-muted">
              Saved guidelines that apply to all ideas for this client
            </p>
          </div>
          {clientId && (
            <>
              <input
                ref={clientFileRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleClientDocumentUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => clientFileRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Uploading...' : '+ Add'}
              </button>
            </>
          )}
        </div>

        {!clientId && (
          <p className="text-sm text-muted italic">Select a client first to manage brand documents</p>
        )}

        {clientDocuments.length > 0 && (
          <div className="space-y-2">
            {clientDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 bg-background rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm truncate">{doc.name}</span>
                  <span className="text-xs text-muted flex-shrink-0">({formatFileSize(doc.file_size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClientDocument(doc)}
                  className="p-1 text-muted hover:text-error transition-colors flex-shrink-0"
                  title="Remove document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Documents Section */}
      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground">Campaign Brief</h4>
            <p className="text-sm text-muted">
              Attach specific briefs or challenges for this session only
            </p>
          </div>
          <input
            ref={sessionFileRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            multiple
            onChange={handleSessionFileAdd}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => sessionFileRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-card-border text-foreground rounded-lg hover:bg-muted/30 transition-colors"
          >
            + Attach
          </button>
        </div>

        {sessionFiles.length > 0 ? (
          <div className="space-y-2">
            {sessionFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-background rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted flex-shrink-0">({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSessionFile(index)}
                  className="p-1 text-muted hover:text-error transition-colors flex-shrink-0"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted italic">No campaign briefs attached</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <p className="text-xs text-muted">
        Supported formats: PDF, Word (.docx), Text (.txt) • Max 10MB per file
      </p>
    </div>
  );
}
