'use client';
import { DownloadIcon } from 'lucide-react';
import React from 'react';

import { downloadAuditJsonAction, downloadAuditXmlAction } from '@/app/actions/audit.actions';
import { SidebarRow } from '@/components/sidebar/SidebarRow';

/*** Renders secondary audit-export actions inside the Export sidebar tab. */
export function ExportPanel() {
  return (
    <div className="pt-3">
      <SidebarRow>
        <ExportButton
          format="JSON"
          mimeType="application/json"
          onExport={downloadAuditJsonAction}
        />
      </SidebarRow>
      <SidebarRow>
        <ExportButton format="XML" mimeType="application/xml" onExport={downloadAuditXmlAction} />
      </SidebarRow>
    </div>
  );
}

/*** Downloads one serialized audit format. */
function ExportButton({ format, mimeType, onExport }: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        const { data, filename } = await onExport();
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }}
      className="flex cursor-pointer items-center text-xs hover:text-blue-600 dark:hover:text-blue-400"
    >
      <DownloadIcon size={10} className="mr-1.5" />
      <span>{format}</span>
    </button>
  );
}

interface ExportButtonProps {
  readonly format: string;
  readonly mimeType: string;
  readonly onExport: () => Promise<{ data: string; filename: string }>;
}
