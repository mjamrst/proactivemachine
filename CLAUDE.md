# Idea Machine

Internal ideation tool for generating sponsorship activation ideas using AI. Built for partnership teams to brainstorm creative concepts for brand-property partnerships.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **AI Models**: Claude (Anthropic) and Palmyra Creative (Writer)
- **Auth**: Custom JWT-based authentication with bcrypt

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin endpoints (ratings, stats, users)
│   │   ├── auth/          # Login/logout/me
│   │   ├── clients/       # Client CRUD + documents
│   │   ├── generate/      # Main idea generation endpoint
│   │   ├── ideas/         # Idea operations (images, ratings)
│   │   ├── search/        # Full-text search
│   │   └── sessions/      # Session management
│   ├── admin/             # Admin dashboard pages
│   ├── history/           # Session history page
│   ├── login/             # Login page
│   ├── presentation/      # Presentation view for sessions
│   ├── session/           # Individual session view
│   └── settings/          # User settings
├── components/
│   ├── forms/             # Form components (selectors, uploaders)
│   ├── ui/                # Base UI components (Button, etc.)
│   └── *.tsx              # Feature components
├── lib/
│   ├── supabase/          # Supabase client and DB helpers
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── db.ts          # Database query functions
│   ├── auth.ts            # Auth utilities
│   ├── claude.ts          # Claude API integration
│   ├── writer.ts          # Writer/Palmyra API integration
│   └── generate-ideas.ts  # Unified AI generation interface
├── types/
│   └── database.ts        # TypeScript types for all entities
└── middleware.ts          # Auth middleware
```

## Key Patterns

### Components
- Client components use `'use client'` directive
- Export components via barrel files (`index.ts`)
- Form components are in `src/components/forms/`
- Use `Section` wrapper for consistent card styling in forms

### API Routes
- Located in `src/app/api/[route]/route.ts`
- Use `NextRequest`/`NextResponse` from `next/server`
- Parse FormData for file uploads, JSON for simple requests
- Always validate required fields and return appropriate status codes

### Database
- All queries go through `src/lib/supabase/db.ts`
- Functions take `SupabaseClient` as first parameter
- Types are defined in `src/types/database.ts`
- Use `Insert` suffix for insert types (e.g., `IdeaInsert`)

### State Management
- Local state with `useState`/`useEffect`
- No global state library - server components fetch data directly
- Client components receive initial data as props

## Database Tables

| Table | Purpose |
|-------|---------|
| `clients` | Brand/client records |
| `properties` | Sports leagues, teams, festivals, etc. |
| `idea_sessions` | Generation sessions with settings |
| `ideas` | Generated ideas with content |
| `users` | User accounts for auth |
| `idea_ratings` | User ratings on ideas (1-3 scale) |
| `client_documents` | Uploaded brand documents |

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI APIs
ANTHROPIC_API_KEY=          # Claude
WRITER_API_KEY=             # Palmyra Creative

# Optional
GOOGLE_AI_API_KEY=          # Gemini (for image generation)
NEXT_PUBLIC_LOGO_DEV_TOKEN= # Logo.dev for client logos
```

## Key Types

```typescript
// AI Models
type AIModel = 'claude' | 'palmyra-creative';

// Idea Lanes (activation categories)
type IdeaLane =
  | 'live_experience' | 'digital' | 'content'
  | 'social_impact' | 'talent_athlete' | 'gaming_esports'
  | 'hospitality_vip' | 'retail_product';

// Output Styles (personality for generated content)
type OutputStyleType =
  | 'generic' | 'techbro' | 'creative_strategist'
  | 'gen_z' | 'sports_expert' | 'world_traveler' | 'data_nerd';
```

## Common Tasks

### Add a new form field
1. Add type to `src/types/database.ts`
2. Update relevant interfaces (`IdeaSession`, `IdeaSessionInsert`, etc.)
3. Create/update component in `src/components/forms/`
4. Export from `src/components/forms/index.ts`
5. Add to `IdeaGeneratorForm.tsx`
6. Update API route to parse and save the field
7. Create SQL migration in `supabase/`

### Add a new API route
1. Create folder in `src/app/api/[routeName]/`
2. Add `route.ts` with HTTP method handlers
3. Use `createClient()` from `@/lib/supabase/server` for DB access
4. Add DB helper functions to `src/lib/supabase/db.ts` if needed

### Database migrations
- SQL files go in `supabase/` folder
- Run manually in Supabase SQL Editor
- Name format: `add_[feature].sql`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Styling Notes

- Uses CSS variables for theming (see `globals.css`)
- Card backgrounds: `bg-card-bg` or `bg-white`
- Borders: `border-card-border` or `border-gray-200`
- Accent color: `bg-accent`, `text-accent`
- Form sections use white cards with `rounded-xl p-6 shadow-sm`
- Headers use `text-lg font-semibold text-foreground`
