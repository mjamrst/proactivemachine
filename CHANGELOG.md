# Primer - Changelog

All notable changes to Primer (formerly Idea Machine) are documented below.

---

## v1.5.1 - Optional Properties & Changelog (February 14, 2026)

### New Features
- **Changelog Page** - Browse the full version history directly on the website

### Improvements
- **Optional Properties** - Properties/Partners are no longer required when generating ideas, allowing activations for a client without selecting a specific property
- Form, API routes, AI prompts, presentation view, and PowerPoint export all gracefully handle sessions with no properties

---

## v1.5.0 - Export & Presentation Upgrades (January 25, 2026)

### New Features
- **PowerPoint Export** - Generate professional PPTX presentations from any session with styled slides, brand metadata, and idea details
- **Export Dropdown** - Choose between PDF and PPTX export formats from the session view
- **Dark/Light Presentation Modes** - Toggle between dark and light themes for the presentation view
- **Google Gemini Integration** - Added Gemini as a third AI model option alongside Claude and Palmyra Creative, with model logo selector
- **Talent/Athlete Name Input** - Dedicated name input field when using the Talent/Athlete idea lane for more targeted activations

### Improvements
- AI model selector now displays branded logos for each model (Claude, Palmyra Creative, Gemini)
- Fixed flash of unstyled content on presentation view load
- Session names now persist correctly across views
- Admin client editing capabilities added

### Housekeeping
- Removed unused files and legacy design assets
- Updated project documentation (CLAUDE.md)

---

## v1.4.0 - Visual Overhaul & Lane Expansion (January 24, 2026)

### New Features
- **4 New Idea Lanes** - Added Talent/Athlete, Gaming/Esports, Hospitality/VIP, and Retail/Product activation categories, bringing the total to 8
- **Social Impact Lane** - Dedicated lane for cause-driven and community-focused activations
- **Expanded Modifier System** - New Audience, Platform, and Budget modifier categories for more precise idea targeting
- **Idea Rating System** - Rate generated ideas on a 1-3 star scale with admin analytics dashboard
- **Palmyra Creative Model** - Added Writer's Palmyra Creative as an alternative AI model for idea generation
- **Inline Idea Editing** - Edit generated idea titles, overviews, features, and brand fit directly in the card view
- **Data Nerd Output Style** - New analytics-driven personality profile for data-focused activations
- **Recently Used Clients** - Quick-access section showing recently used clients at the top of the selector

### Visual & Design
- Renamed app from "Idea Machine" to **Primer** with new logo throughout
- Custom illustrated characters for each output style personality (replacing emojis)
- Custom illustrated icons for all 8 idea lanes
- Notion-inspired design with light grey background and white section cards
- Hero image added to the homepage
- Removed dark mode in favor of a clean, light-only interface
- Lane tile backgrounds updated for visual consistency
- Standardized form section headers across the app
- Wider form layout (max-w-6xl) for better use of screen space

### Improvements
- Output style profiles are now always expanded for easier browsing
- History page no longer expands all sections when collapsing the last one
- Form width increased for a more spacious layout
- Password generator tool added to admin panel
- Admin clients page with delete functionality
- Property logos added for all major leagues, teams, festivals, and events (ESPN CDN, F1, NASCAR)
- Client logos visible on history and session detail pages

---

## v1.3.0 - Output Styles & Personalization (January 23, 2026)

### New Features
- **Output Style Profiles** - Choose from distinct AI personality profiles that shape how ideas are written:
  - No Sauce (generic/neutral)
  - Tech Bro
  - Creative Strategist
  - Gen Z
  - Sports Expert
  - World Traveler
- **Intensity Slider** - Adjustable 1-5 intensity scale for each output style, controlling how strongly the personality comes through
- **Session Naming** - Name your idea generation sessions for easy organization and recall
- **Keyword Search** - Full-text search across all generated ideas from the history page
- **Authentication System** - Username/password login with JWT-based sessions and role-based access control (admin/user)
- **Admin Dashboard** - Manage users, view all sessions, and monitor system usage
- **User Profiles** - First name, last name, office location, and profile picture support
- **Document Upload** - Upload PDFs, Word docs, and text files as brand context for idea generation
- **Property Logos** - Visual logos for sports leagues, teams, music festivals, and cultural events via logo.dev API

### Improvements
- History page now groups sessions by client with collapsible sections
- Show/hide password toggle on login page
- Company logos displayed alongside client names via logo.dev API
- Renamed "sponsorship" to "partnership" across the app
- Intensity slider hidden for "No Sauce" style

---

## v1.2.0 - Image & Theme Support (January 23, 2026)

### New Features
- **Image Upload** - Add images to presentation slides for visual context
- **Persistent Image Storage** - Images stored via Supabase for reliable access across sessions
- **Theme Toggle** - Light, dark, and system theme options

### Bug Fixes
- Fixed presentation slide content overflow issues

---

## v1.1.0 - Core Platform (January 22, 2026)

### New Features
- **AI-Powered Idea Generation** - Generate creative partnership activation ideas using Claude AI
- **Idea Generation Form** - Select clients, properties, idea lanes, and tech modifiers to shape AI output
- **Presentation Export** - View and export generated ideas as styled HTML/PDF presentations
- **Session History** - Browse and revisit previous idea generation sessions
- **Settings Page** - User preferences and configuration

### Foundation
- Next.js app with TypeScript, Tailwind CSS, and Supabase
- Database schema with clients, properties, sessions, and ideas
- Seed data for major sports leagues (NFL, NBA, MLB, NHL, MLS), music festivals, and cultural moments
- Claude API integration with custom system prompt for partnership activations

---

## v1.0.0 - Initial Release (January 22, 2026)

- Project scaffolding with Create Next App
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Supabase (PostgreSQL)
- **AI Models:** Claude (Anthropic), Palmyra Creative (Writer), Google Gemini
- **Auth:** Custom JWT with bcrypt password hashing
- **Export:** pptxgenjs (PowerPoint), HTML/CSS (PDF)
- **Document Processing:** pdf-parse, Mammoth (Word docs)
