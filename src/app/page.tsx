import { IdeaMachineClient } from './IdeaMachineClient';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" />

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Generate Partnership Activation Ideas
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Select a client, properties, and idea lane to generate creative
              partnership activation concepts that export directly to Figma.
            </p>
          </div>

          <IdeaMachineClient />
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
