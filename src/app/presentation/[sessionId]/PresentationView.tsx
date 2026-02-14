'use client';

import { useRef, useState, useCallback } from 'react';
import type { Idea, Client, Property, IdeaSession } from '@/types/database';

interface PresentationViewProps {
  ideas: Idea[];
  client: Client;
  properties: Property[];
  session: IdeaSession;
  theme?: 'dark' | 'light';
}

export function PresentationView({
  ideas,
  client,
  properties,
  session,
  theme = 'dark',
}: PresentationViewProps) {
  const presentationRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Initialize with existing images from database
  const [imageUrls, setImageUrls] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    ideas.forEach((idea) => {
      if (idea.image_url) {
        initial[idea.id] = idea.image_url;
      }
    });
    return initial;
  });

  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPptx = async () => {
    try {
      const response = await fetch(`/api/sessions/${session.id}/export-pptx`);
      if (!response.ok) {
        throw new Error('Failed to generate PowerPoint');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${client.name.replace(/[^a-zA-Z0-9]/g, '_')}_Ideas.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PowerPoint. Please try again.');
    }
  };

  const handleImageClick = (ideaId: string) => {
    if (uploadingIds.has(ideaId)) return;
    const input = fileInputRefs.current.get(ideaId);
    if (input) {
      input.click();
    }
  };

  const handleImageUpload = useCallback(async (ideaId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear any previous error
    setErrorMessages((prev) => {
      const newErrors = { ...prev };
      delete newErrors[ideaId];
      return newErrors;
    });

    // Show loading state
    setUploadingIds((prev) => new Set(prev).add(ideaId));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/ideas/${ideaId}/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update state with the new image URL
      setImageUrls((prev) => ({
        ...prev,
        [ideaId]: data.image_url,
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessages((prev) => ({
        ...prev,
        [ideaId]: error instanceof Error ? error.message : 'Upload failed',
      }));
    } finally {
      setUploadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  }, []);

  const handleRemoveImage = useCallback(async (ideaId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (uploadingIds.has(ideaId)) return;

    // Show loading state
    setUploadingIds((prev) => new Set(prev).add(ideaId));

    try {
      const response = await fetch(`/api/ideas/${ideaId}/image`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      // Remove from state
      setImageUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[ideaId];
        return newUrls;
      });
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessages((prev) => ({
        ...prev,
        [ideaId]: error instanceof Error ? error.message : 'Delete failed',
      }));
    } finally {
      setUploadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  }, [uploadingIds]);

  const laneLabels: Record<string, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
    social_impact: 'Social Impact',
    talent_athlete: 'Talent/Athlete',
    gaming_esports: 'Gaming/Esports',
    hospitality_vip: 'Hospitality/VIP',
    retail_product: 'Retail/Product',
  };

  return (
    <>
      {/* Print/Export Controls - Hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <a
          href="/"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to App
        </a>
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
            <svg className={`w-4 h-4 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {exportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                <button
                  onClick={() => {
                    handleDownloadPptx();
                    setExportMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                >
                  <img src="/pptx-icon.png" alt="PPTX" className="w-5 h-5 object-contain" />
                  PowerPoint
                </button>
                <button
                  onClick={() => {
                    handlePrint();
                    setExportMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                >
                  <img src="/pdf-icon.png" alt="PDF" className="w-5 h-5 object-contain" />
                  PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Presentation Container */}
      <div ref={presentationRef} className={`presentation-container theme-${theme}`}>
        {/* Title Slide */}
        <div className="slide title-slide">
          <div className="slide-content">
            <div className="title-content">
              <p className="subtitle">Sponsorship Activation Ideas</p>
              <h1 className="main-title">{client.name}</h1>
              {properties.length > 0 && (
                <div className="properties-list">
                  {properties.map((p) => p.name).join(' + ')}
                </div>
              )}
              <div className="meta-info">
                <span className="lane-badge">{laneLabels[session.idea_lane]}</span>
                {session.tech_modifiers && session.tech_modifiers.length > 0 && (
                  <span className="tech-badges">
                    {session.tech_modifiers.join(' / ')}
                  </span>
                )}
              </div>
              <p className="idea-count">{ideas.length} Creative Concepts</p>
            </div>
            <div className="branding">
              <span className="brand-text">Primer</span>
            </div>
          </div>
        </div>

        {/* Idea Slides */}
        {ideas.map((idea, index) => (
          <div key={idea.id} className="slide idea-slide">
            <div className="slide-content">
              {/* Header */}
              <div className="slide-header">
                <span className="idea-number">Idea {index + 1}</span>
                <span className="client-name">{client.name}</span>
              </div>

              {/* Main Content */}
              <div className="slide-body">
                {/* Left Column */}
                <div className="left-column">
                  <h2 className="idea-title">{idea.title}</h2>
                  <p className="idea-overview">{idea.overview}</p>

                  <div className="features-section">
                    <h3 className="section-label">Key Features</h3>
                    <ul className="features-list">
                      {idea.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="brand-fit-section">
                    <h3 className="section-label">Why It Works</h3>
                    <p className="brand-fit-text">{idea.brand_fit}</p>
                  </div>
                </div>

                {/* Right Column - Image Prompt */}
                <div className="right-column">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      if (el) fileInputRefs.current.set(idea.id, el);
                    }}
                    onChange={(e) => handleImageUpload(idea.id, e)}
                    className="hidden-file-input"
                  />
                  <div
                    className={`image-placeholder ${imageUrls[idea.id] ? 'has-image' : ''} ${uploadingIds.has(idea.id) ? 'is-loading' : ''}`}
                    onClick={() => handleImageClick(idea.id)}
                  >
                    {uploadingIds.has(idea.id) ? (
                      <div className="loading-spinner">
                        <svg className="spinner" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" />
                        </svg>
                        <p className="loading-label">Uploading...</p>
                      </div>
                    ) : imageUrls[idea.id] ? (
                      <>
                        <img
                          src={imageUrls[idea.id]}
                          alt={idea.title}
                          className="uploaded-image"
                        />
                        <button
                          className="remove-image-btn print:hidden"
                          onClick={(e) => handleRemoveImage(idea.id, e)}
                          title="Remove image"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                        <div className="image-overlay print:hidden">
                          <span>Click to replace</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="placeholder-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                        <p className="placeholder-label">Click to upload image</p>
                        {errorMessages[idea.id] && (
                          <p className="error-message">{errorMessages[idea.id]}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="image-prompt">
                    <h4>Image Prompt:</h4>
                    <p>{idea.image_prompt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End Slide */}
        <div className="slide end-slide">
          <div className="slide-content">
            <div className="end-content">
              <h2>Thank You</h2>
              <p className="end-subtitle">Ready to bring these ideas to life?</p>
              <div className="end-meta">
                <p>{client.name}{properties.length > 0 ? ` × ${properties.map((p) => p.name).join(', ')}` : ''}</p>
                <p className="generated-date">
                  Generated {new Date(session.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="branding">
              <span className="brand-text">Powered by Primer</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
