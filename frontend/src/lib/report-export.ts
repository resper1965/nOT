// Report Export Utilities
// Funções para exportar relatórios em CSV e PDF

/**
 * Converte dados de relatório para CSV
 */
export function generateCSV(report: any): string {
  const lines: string[] = [];
  
  // Header
  lines.push('Código,Controle,Status,Evidências,Exceção,Última Revisão');
  
  // Dados dos controles
  if (report.controls && Array.isArray(report.controls)) {
    report.controls.forEach((control: any) => {
      const status = control.assessment_result?.status || 'Não avaliado';
      const evidenceCount = control.evidence_count || 0;
      const hasException = control.has_exception ? 'Sim' : 'Não';
      const lastReview = control.assessment_result?.updated_at 
        ? new Date(control.assessment_result.updated_at).toLocaleDateString('pt-BR')
        : 'N/A';
      
      // Escapar vírgulas e aspas no CSV
      const escapeCSV = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      
      lines.push([
        escapeCSV(control.control_code || ''),
        escapeCSV(control.control_title || ''),
        escapeCSV(status),
        evidenceCount.toString(),
        escapeCSV(hasException),
        escapeCSV(lastReview),
      ].join(','));
    });
  }
  
  return lines.join('\n');
}

/**
 * Gera HTML para PDF (template básico)
 */
export function generatePDFHTML(report: any, frameworkName: string): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  const statusLabels: Record<string, string> = {
    compliant: 'Conforme',
    partially_compliant: 'Parcialmente Conforme',
    non_compliant: 'Não Conforme',
    not_applicable: 'Não Aplicável',
  };
  
  const statusColors: Record<string, string> = {
    compliant: '#10b981',
    partially_compliant: '#f59e0b',
    non_compliant: '#ef4444',
    not_applicable: '#6b7280',
  };
  
  const controlsHTML = report.controls?.map((control: any) => {
    const status = control.assessment_result?.status || 'Não avaliado';
    const statusLabel = statusLabels[status] || status;
    const statusColor = statusColors[status] || '#6b7280';
    const evidenceCount = control.evidence_count || 0;
    const hasException = control.has_exception ? 'Sim' : 'Não';
    const lastReview = control.assessment_result?.updated_at 
      ? new Date(control.assessment_result.updated_at).toLocaleDateString('pt-BR')
      : 'N/A';
    
    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${control.control_code || ''}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${control.control_title || ''}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="color: ${statusColor}; font-weight: 600;">${statusLabel}</span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${evidenceCount}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${hasException}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${lastReview}</td>
      </tr>
    `;
  }).join('') || '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 12px;
      color: #1f2937;
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #00ade8;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 10px 0;
    }
    .header .subtitle {
      color: #6b7280;
      font-size: 14px;
    }
    .summary {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-item .label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .summary-item .value {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #f3f4f6;
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #374151;
      border: 1px solid #e5e7eb;
    }
    td {
      padding: 8px;
      border: 1px solid #e5e7eb;
      font-size: 11px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 10px;
    }
    .logo {
      color: #111827;
      font-weight: 600;
      font-size: 18px;
    }
    .logo .dot {
      color: #00ade8;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório de Conformidade - ${frameworkName}</h1>
    <div class="subtitle">Gerado em ${today}</div>
  </div>
  
  <div class="summary">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="label">Total de Controles</div>
        <div class="value">${report.summary?.total_controls || 0}</div>
      </div>
      <div class="summary-item">
        <div class="label">Avaliações</div>
        <div class="value">${report.summary?.total_assessments || 0}</div>
      </div>
      <div class="summary-item">
        <div class="label">Evidências</div>
        <div class="value">${report.summary?.total_evidence_packages || 0}</div>
      </div>
      <div class="summary-item">
        <div class="label">Exceções</div>
        <div class="value">${report.summary?.total_exceptions || 0}</div>
      </div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Controle</th>
        <th>Status</th>
        <th>Evidências</th>
        <th>Exceção</th>
        <th>Última Revisão</th>
      </tr>
    </thead>
    <tbody>
      ${controlsHTML}
    </tbody>
  </table>
  
  <div class="footer">
    <div class="logo">ness<span class="dot">.</span></div>
    <div style="margin-top: 5px;">Relatório gerado automaticamente pelo sistema ness. OT GRC</div>
  </div>
</body>
</html>
  `;
}

