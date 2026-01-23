'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import type { Client } from '@/types/database';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelect: (clientId: string) => void;
  onAddClient: (name: string) => Promise<Client>;
}

export function ClientSelector({
  clients,
  selectedClientId,
  onSelect,
  onAddClient,
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddClient = async () => {
    if (!newClientName.trim()) {
      setError('Client name is required');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      const newClient = await onAddClient(newClientName.trim());
      onSelect(newClient.id);
      setNewClientName('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Client
      </label>

      <div ref={dropdownRef} className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-left hover:border-muted focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <span className={selectedClient ? 'text-foreground' : 'text-muted'}>
            {selectedClient?.name || 'Select a client...'}
          </span>
          <svg
            className={`w-5 h-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg">
            {/* Search Input */}
            <div className="p-2 border-b border-card-border">
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-card-border rounded-md text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
            </div>

            {/* Client List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted">No clients found</div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      onSelect(client.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-card-border transition-colors ${
                      client.id === selectedClientId
                        ? 'bg-accent/10 text-accent'
                        : 'text-foreground'
                    }`}
                  >
                    {client.name}
                  </button>
                ))
              )}
            </div>

            {/* Add New Client Button */}
            <div className="p-2 border-t border-card-border">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Client
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewClientName('');
          setError('');
        }}
        title="Add New Client"
      >
        <div className="space-y-4">
          <Input
            label="Client Name"
            placeholder="e.g., Nike, Coca-Cola"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            error={error}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setNewClientName('');
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddClient} isLoading={isAdding}>
              Add Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
