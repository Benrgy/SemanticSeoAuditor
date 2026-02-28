export interface AuditData {
  id: string;
  url: string;
  score: number;
  status: string;
  created_at: string;
  issues?: any[];
  recommendations?: any[];
  metadata?: any;
  [key: string]: any;
}

export async function exportToJSON(data: AuditData | AuditData[]): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `seo-audit-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToCSV(data: AuditData[]): Promise<void> {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  const headers = ['ID', 'URL', 'Score', 'Status', 'Created At', 'Issues Count'];
  const rows = data.map(audit => [
    audit.id,
    audit.url,
    audit.score?.toString() || 'N/A',
    audit.status,
    new Date(audit.created_at).toLocaleString(),
    audit.issues?.length?.toString() || '0',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `seo-audits-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(audit: AuditData): Promise<void> {
  const content = generatePDFContent(audit);

  const style = `
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      h1 {
        color: #1e40af;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      h2 {
        color: #1e40af;
        margin-top: 30px;
        margin-bottom: 15px;
      }
      .score {
        font-size: 48px;
        font-weight: bold;
        text-align: center;
        margin: 30px 0;
      }
      .score.good { color: #10b981; }
      .score.warning { color: #f59e0b; }
      .score.poor { color: #ef4444; }
      .metadata {
        background: #f3f4f6;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .metadata-item {
        margin: 5px 0;
      }
      .metadata-label {
        font-weight: 600;
        color: #4b5563;
      }
      .issue {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 15px;
        margin: 10px 0;
        border-radius: 4px;
      }
      .issue-title {
        font-weight: 600;
        color: #991b1b;
        margin-bottom: 5px;
      }
      .recommendation {
        background: #ecfdf5;
        border-left: 4px solid #10b981;
        padding: 15px;
        margin: 10px 0;
        border-radius: 4px;
      }
      .recommendation-title {
        font-weight: 600;
        color: #065f46;
        margin-bottom: 5px;
      }
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: #6b7280;
        font-size: 14px;
      }
    </style>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SEO Audit Report - ${audit.url}</title>
        ${style}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url);
      }, 250);
    });
  }
}

function generatePDFContent(audit: AuditData): string {
  const scoreClass = audit.score >= 80 ? 'good' : audit.score >= 60 ? 'warning' : 'poor';

  let content = `
    <h1>SEO Audit Report</h1>

    <div class="metadata">
      <div class="metadata-item">
        <span class="metadata-label">URL:</span> ${audit.url}
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Date:</span> ${new Date(audit.created_at).toLocaleString()}
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Status:</span> ${audit.status}
      </div>
    </div>

    <div class="score ${scoreClass}">
      ${audit.score}/100
    </div>

    <h2>Summary</h2>
    <p>
      This SEO audit was performed on ${new Date(audit.created_at).toLocaleDateString()}.
      The site received a score of ${audit.score} out of 100.
    </p>
  `;

  if (audit.issues && audit.issues.length > 0) {
    content += `
      <h2>Issues Found (${audit.issues.length})</h2>
    `;

    audit.issues.slice(0, 20).forEach((issue: any) => {
      content += `
        <div class="issue">
          <div class="issue-title">${issue.title || issue.type || 'Issue'}</div>
          <div>${issue.description || issue.message || 'No description available'}</div>
        </div>
      `;
    });

    if (audit.issues.length > 20) {
      content += `<p><em>... and ${audit.issues.length - 20} more issues</em></p>`;
    }
  }

  if (audit.recommendations && audit.recommendations.length > 0) {
    content += `
      <h2>Recommendations (${audit.recommendations.length})</h2>
    `;

    audit.recommendations.slice(0, 10).forEach((rec: any) => {
      content += `
        <div class="recommendation">
          <div class="recommendation-title">${rec.title || 'Recommendation'}</div>
          <div>${rec.description || rec.message || 'No description available'}</div>
        </div>
      `;
    });

    if (audit.recommendations.length > 10) {
      content += `<p><em>... and ${audit.recommendations.length - 10} more recommendations</em></p>`;
    }
  }

  content += `
    <div class="footer">
      <p>Generated by SEO Auditor</p>
      <p>Report ID: ${audit.id}</p>
    </div>
  `;

  return content;
}

export async function exportAudit(audit: AuditData, format: 'json' | 'csv' | 'pdf'): Promise<void> {
  switch (format) {
    case 'json':
      await exportToJSON(audit);
      break;
    case 'csv':
      await exportToCSV([audit]);
      break;
    case 'pdf':
      await exportToPDF(audit);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

export async function exportMultipleAudits(audits: AuditData[], format: 'json' | 'csv'): Promise<void> {
  switch (format) {
    case 'json':
      await exportToJSON(audits);
      break;
    case 'csv':
      await exportToCSV(audits);
      break;
    default:
      throw new Error(`Unsupported export format for multiple audits: ${format}`);
  }
}
