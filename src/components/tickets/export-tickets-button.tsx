'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api/api-client';

export function ExportTicketsButton() {
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Build the query to fetch all tickets (using a high limit like 1000)
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', '1000');

      const response = await apiClient<{ data: { items: any[] } }>(`/tickets?${params.toString()}`);
      const tickets = response?.data?.items || [];

      if (tickets.length === 0) {
        toast.error('No tickets found to export.');
        return;
      }

      // Convert to CSV
      const headers = ['ID', 'Title', 'Status', 'Priority', 'Client', 'Project', 'Created At'];
      const rows = tickets.map((t) => [
        `TKT-${new Date(t.createdAt).getFullYear()}-${t.number.toString().padStart(5, '0')}`,
        `"${t.title.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        `"${(t.client?.name || '').replace(/"/g, '""')}"`,
        `"${(t.project?.name || '').replace(/"/g, '""')}"`,
        new Date(t.createdAt).toISOString(),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `tickets_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Tickets exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export tickets');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
      className="h-9 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4 text-slate-500" />
      )}
      Export
    </Button>
  );
}
