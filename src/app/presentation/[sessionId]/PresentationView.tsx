'use client';

import { useRef } from 'react';
import type { Idea, Client, Property, IdeaSession } from '@/types/database';

interface PresentationViewProps {
  ideas: Idea[];
  client: Client;
  properties: Property[];
  session: IdeaSession;
}

export function PresentationView({
  ideas,
  client,
  properties,
  session,
}: PresentationViewProps) {
  const presentationRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const laneLabels: Record<string, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
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
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export to PDF
        </button>
      </div>

      {/* Presentation Container */}
      <div ref={presentationRef} className="presentation-container">
        {/* Title Slide */}
        <div className="slide title-slide">
          <div className="slide-content">
            <div className="title-content">
              <p className="subtitle">Sponsorship Activation Ideas</p>
              <h1 className="main-title">{client.name}</h1>
              <div className="properties-list">
                {properties.map((p) => p.name).join(' + ')}
              </div>
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
              <span className="brand-text">Idea Machine</span>
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
                  <div className="image-placeholder">
                    <div className="placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                    <p className="placeholder-label">Hero Image</p>
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
                <p>{client.name} × {properties.map((p) => p.name).join(', ')}</p>
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
              <span className="brand-text">Powered by Idea Machine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Styles */}
      <style jsx global>{`
        @media screen {
          body {
            background: #1a1a1a;
            margin: 0;
            padding: 40px 20px;
          }

          .presentation-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .slide {
            background: #0a0a0a;
            border-radius: 12px;
            margin-bottom: 40px;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }
        }

        @media print {
          @page {
            size: landscape;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .presentation-container {
            width: 100%;
          }

          .slide {
            page-break-after: always;
            page-break-inside: avoid;
            width: 100vw;
            height: 100vh;
            margin: 0;
            border-radius: 0;
          }

          .slide:last-child {
            page-break-after: auto;
          }
        }

        .slide {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .slide-content {
          height: 100%;
          padding: 48px 64px;
          display: flex;
          flex-direction: column;
        }

        /* Title Slide */
        .title-slide .slide-content {
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .title-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .subtitle {
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #0066FF;
          margin-bottom: 16px;
        }

        .main-title {
          font-size: 72px;
          font-weight: 800;
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #fff 0%, #ccc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .properties-list {
          font-size: 28px;
          color: #888;
          margin-bottom: 32px;
        }

        .meta-info {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .lane-badge {
          background: #0066FF;
          padding: 8px 20px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
        }

        .tech-badges {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 20px;
          border-radius: 24px;
          font-size: 14px;
        }

        .idea-count {
          font-size: 20px;
          color: #666;
        }

        .branding {
          padding-top: 24px;
        }

        .brand-text {
          font-size: 14px;
          color: #444;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Idea Slides */
        .slide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .idea-number {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #0066FF;
          font-weight: 600;
        }

        .client-name {
          font-size: 14px;
          color: #666;
        }

        .slide-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
        }

        .idea-title {
          font-size: 42px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: white;
        }

        .idea-overview {
          font-size: 18px;
          line-height: 1.6;
          color: #aaa;
          margin: 0 0 32px 0;
        }

        .section-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #0066FF;
          margin: 0 0 12px 0;
          font-weight: 600;
        }

        .features-section {
          margin-bottom: 24px;
        }

        .features-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .features-list li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          font-size: 15px;
          color: #ccc;
          line-height: 1.5;
        }

        .features-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          background: #0066FF;
          border-radius: 50%;
        }

        .brand-fit-section {
          background: rgba(0, 102, 255, 0.1);
          border: 1px solid rgba(0, 102, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-top: auto;
        }

        .brand-fit-text {
          margin: 0;
          font-size: 15px;
          color: #ddd;
          line-height: 1.6;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-placeholder {
          flex: 1;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .placeholder-icon {
          width: 64px;
          height: 64px;
          color: #333;
          margin-bottom: 12px;
        }

        .placeholder-label {
          color: #444;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .image-prompt {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
        }

        .image-prompt h4 {
          margin: 0 0 8px 0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
        }

        .image-prompt p {
          margin: 0;
          font-size: 12px;
          color: #888;
          line-height: 1.5;
          font-style: italic;
        }

        /* End Slide */
        .end-slide .slide-content {
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .end-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .end-content h2 {
          font-size: 64px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .end-subtitle {
          font-size: 24px;
          color: #888;
          margin: 0 0 48px 0;
        }

        .end-meta {
          color: #666;
        }

        .end-meta p {
          margin: 8px 0;
        }

        .generated-date {
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
