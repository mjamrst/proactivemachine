import { SettingsClient } from './SettingsClient';
import { Header } from '@/components/Header';

export default function SettingsPage() {
  // Check which services are configured (server-side)
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="settings" />

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted">
              Configure your Primer instance
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
          Primer - AI-Powered Activation Ideas
        </div>
      </footer>
    </div>
  );
}
