export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-accent">Idea</span> Machine
          </h1>
          <nav className="flex gap-4">
            <a href="/settings" className="text-muted hover:text-foreground transition-colors">
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Generate Sponsorship Activation Ideas
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Select a client, properties, and idea lane to generate creative
              sponsorship activation concepts that export directly to Figma.
            </p>
          </div>

          {/* Placeholder for form - will be built in Phase 2 */}
          <div className="bg-card-bg border border-card-border rounded-xl p-8 max-w-4xl mx-auto">
            <p className="text-muted text-center">
              Idea generation form will be built in Phase 2.
              <br />
              <span className="text-sm">
                Phase 1 complete: Project setup + Supabase schema + seed data
              </span>
            </p>
          </div>
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
