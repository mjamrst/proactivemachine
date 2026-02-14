'use client';

import { Header } from '@/components/Header';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  sections: {
    heading: string;
    items: string[];
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.5.0',
    date: 'January 25, 2026',
    title: 'Export & Presentation Upgrades',
    sections: [
      {
        heading: 'New Features',
        items: [
          'PowerPoint Export - Generate professional PPTX presentations from any session with styled slides, brand metadata, and idea details',
          'Export Dropdown - Choose between PDF and PPTX export formats from the session view',
          'Dark/Light Presentation Modes - Toggle between dark and light themes for the presentation view',
          'Google Gemini Integration - Added Gemini as a third AI model option alongside Claude and Palmyra Creative, with model logo selector',
          'Talent/Athlete Name Input - Dedicated name input field when using the Talent/Athlete idea lane for more targeted activations',
        ],
      },
      {
        heading: 'Improvements',
        items: [
          'AI model selector now displays branded logos for each model',
          'Fixed flash of unstyled content on presentation view load',
          'Session names now persist correctly across views',
          'Admin client editing capabilities added',
        ],
      },
      {
        heading: 'Housekeeping',
        items: [
          'Removed unused files and legacy design assets',
          'Updated project documentation',
        ],
      },
    ],
  },
  {
    version: '1.4.0',
    date: 'January 24, 2026',
    title: 'Visual Overhaul & Lane Expansion',
    sections: [
      {
        heading: 'New Features',
        items: [
          '4 New Idea Lanes - Added Talent/Athlete, Gaming/Esports, Hospitality/VIP, and Retail/Product activation categories, bringing the total to 8',
          'Social Impact Lane - Dedicated lane for cause-driven and community-focused activations',
          'Expanded Modifier System - New Audience, Platform, and Budget modifier categories for more precise idea targeting',
          'Idea Rating System - Rate generated ideas on a 1-3 star scale with admin analytics dashboard',
          'Palmyra Creative Model - Added Writer\'s Palmyra Creative as an alternative AI model for idea generation',
          'Inline Idea Editing - Edit generated idea titles, overviews, features, and brand fit directly in the card view',
          'Data Nerd Output Style - New analytics-driven personality profile for data-focused activations',
          'Recently Used Clients - Quick-access section showing recently used clients at the top of the selector',
        ],
      },
      {
        heading: 'Visual & Design',
        items: [
          'Renamed app from "Idea Machine" to Primer with new logo throughout',
          'Custom illustrated characters for each output style personality',
          'Custom illustrated icons for all 8 idea lanes',
          'Notion-inspired design with light grey background and white section cards',
          'Hero image added to the homepage',
          'Removed dark mode in favor of a clean, light-only interface',
          'Lane tile backgrounds updated for visual consistency',
          'Wider form layout for better use of screen space',
        ],
      },
      {
        heading: 'Improvements',
        items: [
          'Output style profiles are now always expanded for easier browsing',
          'History page no longer expands all sections when collapsing the last one',
          'Password generator tool added to admin panel',
          'Admin clients page with delete functionality',
          'Property logos added for all major leagues, teams, festivals, and events',
          'Client logos visible on history and session detail pages',
        ],
      },
    ],
  },
  {
    version: '1.3.0',
    date: 'January 23, 2026',
    title: 'Output Styles & Personalization',
    sections: [
      {
        heading: 'New Features',
        items: [
          'Output Style Profiles - Choose from distinct AI personality profiles: No Sauce, Tech Bro, Creative Strategist, Gen Z, Sports Expert, and World Traveler',
          'Intensity Slider - Adjustable 1-5 intensity scale for each output style, controlling how strongly the personality comes through',
          'Session Naming - Name your idea generation sessions for easy organization and recall',
          'Keyword Search - Full-text search across all generated ideas from the history page',
          'Authentication System - Username/password login with JWT-based sessions and role-based access control',
          'Admin Dashboard - Manage users, view all sessions, and monitor system usage',
          'User Profiles - First name, last name, office location, and profile picture support',
          'Document Upload - Upload PDFs, Word docs, and text files as brand context for idea generation',
          'Property Logos - Visual logos for sports leagues, teams, music festivals, and cultural events',
        ],
      },
      {
        heading: 'Improvements',
        items: [
          'History page now groups sessions by client with collapsible sections',
          'Show/hide password toggle on login page',
          'Company logos displayed alongside client names',
          'Renamed "sponsorship" to "partnership" across the app',
        ],
      },
    ],
  },
  {
    version: '1.2.0',
    date: 'January 23, 2026',
    title: 'Image & Theme Support',
    sections: [
      {
        heading: 'New Features',
        items: [
          'Image Upload - Add images to presentation slides for visual context',
          'Persistent Image Storage - Images stored via Supabase for reliable access across sessions',
          'Theme Toggle - Light, dark, and system theme options',
        ],
      },
      {
        heading: 'Bug Fixes',
        items: [
          'Fixed presentation slide content overflow issues',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: 'January 22, 2026',
    title: 'Core Platform',
    sections: [
      {
        heading: 'New Features',
        items: [
          'AI-Powered Idea Generation - Generate creative partnership activation ideas using Claude AI',
          'Idea Generation Form - Select clients, properties, idea lanes, and tech modifiers to shape AI output',
          'Presentation Export - View and export generated ideas as styled HTML/PDF presentations',
          'Session History - Browse and revisit previous idea generation sessions',
          'Settings Page - User preferences and configuration',
        ],
      },
      {
        heading: 'Foundation',
        items: [
          'Next.js app with TypeScript, Tailwind CSS, and Supabase',
          'Database schema with clients, properties, sessions, and ideas',
          'Seed data for major sports leagues, music festivals, and cultural moments',
          'Claude API integration with custom system prompt for partnership activations',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 22, 2026',
    title: 'Initial Release',
    sections: [
      {
        heading: 'Foundation',
        items: [
          'Project scaffolding with Next.js 16, React 19, TypeScript 5, and Tailwind CSS 4',
        ],
      },
    ],
  },
];

const sectionIcons: Record<string, string> = {
  'New Features': 'M12 4v16m8-8H4',
  'Improvements': 'M5 10l7-7m0 0l7 7m-7-7v18',
  'Visual & Design': 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
  'Bug Fixes': 'M12 12l-8 4V8l8-4 8 4v8l-8 4z',
  'Housekeeping': 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
  'Foundation': 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21',
};

function SectionIcon({ heading }: { heading: string }) {
  const path = sectionIcons[heading] || sectionIcons['New Features'];
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="changelog" />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Changelog</h1>
            <p className="text-muted">
              New features, improvements, and fixes for Primer.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-0 w-px bg-card-border" />

            <div className="space-y-10">
              {changelog.map((entry) => (
                <div key={entry.version} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-accent border-[3px] border-background" />

                  {/* Version header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-accent text-white">
                        v{entry.version}
                      </span>
                      <span className="text-sm text-muted">{entry.date}</span>
                    </div>
                    <h2 className="text-xl font-semibold mt-2">{entry.title}</h2>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    {entry.sections.map((section) => (
                      <div key={section.heading} className="bg-card-bg rounded-xl p-5 border border-card-border">
                        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                          <SectionIcon heading={section.heading} />
                          {section.heading}
                        </h3>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => {
                            const dashIndex = item.indexOf(' - ');
                            const hasLabel = dashIndex > 0 && dashIndex < 40;
                            return (
                              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                                <span className="text-accent mt-1.5 shrink-0">
                                  <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 6 6">
                                    <circle cx="3" cy="3" r="3" />
                                  </svg>
                                </span>
                                {hasLabel ? (
                                  <span>
                                    <span className="font-medium text-foreground">{item.substring(0, dashIndex)}</span>
                                    <span className="text-muted"> &mdash; {item.substring(dashIndex + 3)}</span>
                                  </span>
                                ) : (
                                  <span className="text-foreground">{item}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack footer */}
          <div className="mt-12 pt-8 border-t border-card-border">
            <h2 className="text-lg font-semibold mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Frontend', value: 'Next.js 16, React 19' },
                { label: 'Language', value: 'TypeScript 5' },
                { label: 'Styling', value: 'Tailwind CSS 4' },
                { label: 'Database', value: 'Supabase (PostgreSQL)' },
                { label: 'AI Models', value: 'Claude, Gemini, Palmyra' },
                { label: 'Auth', value: 'JWT + bcrypt' },
              ].map((item) => (
                <div key={item.label} className="bg-card-bg rounded-lg p-3 border border-card-border">
                  <div className="text-xs text-muted uppercase tracking-wider">{item.label}</div>
                  <div className="text-sm font-medium mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-muted text-sm">
          Primer - AI-Powered Activation Ideas
        </div>
      </footer>
    </div>
  );
}
