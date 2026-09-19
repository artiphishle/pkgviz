'use client';
import { Button } from '@zora/button';
import { View } from '@zora/view';

import { downloadAuditJsonAction, downloadAuditXmlAction } from '@/app/actions/audit.actions';
import type { ZoraMode } from '@/types/zora';

/*** Renders audit-export actions with generated ZORA buttons. */
export function AuditExportPanel({ mode }: AuditExportPanelProps) {
  return (
    <View mode={mode} gap="s" p="m">
      <ExportButton
        format="JSON"
        mimeType="application/json"
        mode={mode}
        onExport={downloadAuditJsonAction}
      />
      <ExportButton
        format="XML"
        mimeType="application/xml"
        mode={mode}
        onExport={downloadAuditXmlAction}
      />
    </View>
  );
}

/*** Downloads one serialized audit format from a ZORA action button. */
function ExportButton({ format, mimeType, mode, onExport }: ExportButtonProps) {
  return (
    <Button
      fullWidth
      leadingIcon={{ name: 'download-outline' }}
      mode={mode}
      size="s"
      variant="ghost"
      onPress={async () => {
        const { data, filename } = await onExport();
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }}
    >
      {format}
    </Button>
  );
}

interface AuditExportPanelProps {
  readonly mode: ZoraMode;
}

interface ExportButtonProps extends AuditExportPanelProps {
  readonly format: string;
  readonly mimeType: string;
  readonly onExport: () => Promise<{ data: string; filename: string }>;
}
