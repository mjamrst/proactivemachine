'use client';

interface SettingsClientProps {
  hasSupabase: boolean;
  hasClaude: boolean;
}

export function SettingsClient({ hasSupabase, hasClaude }: SettingsClientProps) {
  return (
    <div className="space-y-8">
      {/* API Status */}
      <section className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Service Status</h2>
        <div className="space-y-4">
          {/* Supabase */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${hasSupabase ? 'bg-success' : 'bg-error'}`} />
              <div>
                <p className="font-medium">Supabase Database</p>
                <p className="text-sm text-muted">Stores clients, properties, and sessions</p>
              </div>
            </div>
            <span className={`text-sm ${hasSupabase ? 'text-success' : 'text-error'}`}>
              {hasSupabase ? 'Connected' : 'Not Configured'}
            </span>
          </div>

          {/* Claude */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${hasClaude ? 'bg-success' : 'bg-error'}`} />
              <div>
                <p className="font-medium">Claude API</p>
                <p className="text-sm text-muted">Powers idea generation</p>
              </div>
            </div>
            <span className={`text-sm ${hasClaude ? 'text-success' : 'text-error'}`}>
              {hasClaude ? 'Connected' : 'Not Configured'}
            </span>
          </div>
        </div>
      </section>

      {/* Configuration Guide */}
      <section className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <p className="text-muted mb-4">
          API keys are configured via environment variables for security. Update your{' '}
          <code className="px-2 py-0.5 bg-background rounded text-accent">.env.local</code>{' '}
          file with the following:
        </p>
        <div className="bg-background rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-muted">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Claude API Configuration
ANTHROPIC_API_KEY=your-api-key`}
          </pre>
        </div>
      </section>

      {/* About */}
      <section className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">About Idea Machine</h2>
        <p className="text-muted mb-4">
          Idea Machine is an internal ideation tool for brand consulting teams. It helps generate
          creative sponsorship activation ideas using AI and exports them as presentation-ready slides.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-background rounded-lg">
            <p className="font-medium mb-1">Tech Stack</p>
            <p className="text-muted">Next.js, React, Tailwind CSS, Supabase, Claude API</p>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <p className="font-medium mb-1">Version</p>
            <p className="text-muted">1.0.0</p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-card-border transition-colors"
          >
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span className="text-sm font-medium">Supabase Dashboard</span>
          </a>
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-card-border transition-colors"
          >
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Anthropic Console</span>
          </a>
          <a
            href="https://github.com/mjamrst/proactivemachine"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-card-border transition-colors"
          >
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">GitHub Repo</span>
          </a>
        </div>
      </section>
    </div>
  );
}
