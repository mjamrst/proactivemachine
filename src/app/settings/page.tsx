import { SettingsClient } from './SettingsClient';

export default function SettingsPage() {
  // Check which services are configured (server-side)
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            <span className="text-accent">Idea</span> Machine
          </a>
          <nav className="flex gap-4">
            <a href="/settings" className="text-accent font-medium">
              Settings
            </a>
            <a href="/history" className="text-muted hover:text-foreground transition-colors">
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted">
              Configure your Idea Machine instance
            </p>
          </div>

          <SettingsClient
            hasSupabase={hasSupabase}
            hasClaude={hasClaude}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-muted text-sm">
          Idea Machine - Internal Ideation Tool
        </div>
      </footer>
    </div>
  );
}
