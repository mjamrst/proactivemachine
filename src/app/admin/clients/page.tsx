'use client';

import { useState, useEffect } from 'react';
import { ClientLogo } from '@/components/ClientLogo';

interface Client {
  id: string;
  name: string;
  domain: string | null;
  created_at: string;
  session_count: number;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data.clients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    setDeletingId(clientId);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete client');
      }

      setClients(clients.filter(c => c.id !== clientId));
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clients</h2>
          <p className="text-muted text-sm mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Client</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Domain</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Sessions</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Created</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-card-border last:border-b-0 hover:bg-card-border/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClientLogo domain={client.domain} name={client.name} size="md" />
                    <span className="font-medium text-foreground">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {client.domain ? (
                    <span className="text-sm text-muted">{client.domain}</span>
                  ) : (
                    <span className="text-sm text-muted/50">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${client.session_count > 0 ? 'text-foreground' : 'text-muted'}`}>
                    {client.session_count}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted">{formatDate(client.created_at)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  {confirmDelete === client.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted mr-2">Delete?</span>
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="px-3 py-1.5 text-sm bg-error text-white rounded-lg hover:bg-error/90 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === client.id ? 'Deleting...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 text-sm bg-card-border text-foreground rounded-lg hover:bg-muted/20 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(client.id)}
                      disabled={client.session_count > 0}
                      className="px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={client.session_count > 0 ? 'Cannot delete client with existing sessions' : 'Delete client'}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted">No clients found</p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted">
        Note: Clients with existing sessions cannot be deleted. Delete the sessions first from the history page.
      </p>
    </div>
  );
}
