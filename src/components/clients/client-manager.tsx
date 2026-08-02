'use client';

import { useState } from 'react';

import { ClientList } from './client-list';
import { ClientSidePanel } from './client-side-panel';

export function ClientManager() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50/50">
      {/* Left Pane: Main List */}
      <div className="flex min-w-0 flex-1 flex-col p-8 transition-all duration-300">
        <ClientList selectedClientId={selectedClientId} onSelectClient={setSelectedClientId} />
      </div>

      {/* Right Pane: Slide-out Panel */}
      {selectedClientId && (
        <ClientSidePanel clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
      )}
    </div>
  );
}
