// Report Export Utilities
// Funções para exportar relatórios em CSV e PDF

/**
 * Converte dados de relatório para CSV
 * Melhorado com estrutura mais completa e encoding UTF-8 BOM
 */
export function generateCSV(report: any): string {
  const lines: string[] = [];
  
  // BOM UTF-8 para Excel
  lines.push('\ufeff');
  
  // Header principal
  lines.push(`Relatório de Conformidade - ${report.framework?.framework_name || 'Framework'}`);
  lines.push(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push('');
  
  // Resumo
  lines.push('RESUMO');
  lines.push(`Total de Controles,${report.summary?.total_controls || 0}`);
  lines.push(`Total de Avaliações,${report.summary?.total_assessments || 0}`);
  lines.push(`Total de Evidências,${report.summary?.total_evidence_packages || 0}`);
  lines.push(`Total de Exceções,${report.summary?.total_exceptions || 0}`);
  lines.push('');
  
  // Header da tabela de controles
  lines.push('DETALHES DOS CONTROLES');
  lines.push('Código,Controle,Descrição,Status,Evidências,Exceção,Justificativa Exceção,Última Revisão,Responsável,Próxima Revisão');
  
  // Dados dos controles
  if (report.controls && Array.isArray(report.controls)) {
    report.controls.forEach((control: any) => {
      const status = control.assessment_result?.status || 'Não avaliado';
      const statusLabels: Record<string, string> = {
        compliant: 'Conforme',
        partially_compliant: 'Parcialmente Conforme',
        non_compliant: 'Não Conforme',
        not_applicable: 'Não Aplicável',
      };
      const statusLabel = statusLabels[status] || status;
      
      const evidenceCount = control.evidence_count || 0;
      const hasException = control.has_exception ? 'Sim' : 'Não';
      const exceptionJustification = control.exception?.justification || '';
      const lastReview = control.assessment_result?.updated_at 
        ? new Date(control.assessment_result.updated_at).toLocaleDateString('pt-BR')
        : 'N/A';
      const responsible = control.metadata?.responsible || '';
      const nextReview = control.metadata?.next_review 
        ? new Date(control.metadata.next_review).toLocaleDateString('pt-BR')
        : 'N/A';
      
      // Escapar vírgulas e aspas no CSV
      const escapeCSV = (value: string) => {
        if (!value) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      lines.push([
        escapeCSV(control.control_code || ''),
        escapeCSV(control.control_title || ''),
        escapeCSV(control.control_description || ''),
        escapeCSV(statusLabel),
        evidenceCount.toString(),
        escapeCSV(hasException),
        escapeCSV(exceptionJustification),
        escapeCSV(lastReview),
        escapeCSV(responsible),
        escapeCSV(nextReview),
      ].join(','));
    });
  }
  
  // Footer
  lines.push('');
  lines.push('Relatório gerado automaticamente pelo sistema ness. OT GRC');
  
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
    const statusClasses: Record<string, string> = {
      compliant: 'status-compliant',
      partially_compliant: 'status-partial',
      non_compliant: 'status-non-compliant',
      not_applicable: 'status-not-applicable',
    };
    const statusClass = statusClasses[status] || 'status-not-applicable';
    
    const evidenceCount = control.evidence_count || 0;
    const hasException = control.has_exception ? 'Sim' : 'Não';
    const lastReview = control.assessment_result?.updated_at 
      ? new Date(control.assessment_result.updated_at).toLocaleDateString('pt-BR')
      : 'N/A';
    
    return `
      <tr>
        <td>${control.control_code || ''}</td>
        <td>${control.control_title || ''}</td>
        <td>
          <span class="status-badge ${statusClass}">${statusLabel}</span>
        </td>
        <td style="text-align: center;">${evidenceCount}</td>
        <td style="text-align: center;">${hasException}</td>
        <td>${lastReview}</td>
      </tr>
    `;
  }).join('') || '';
  
  // Calcular estatísticas de conformidade
  const totalControls = report.summary?.total_controls || 0;
  const compliantCount = report.controls?.filter((c: any) => c.assessment_result?.status === 'compliant').length || 0;
  const partiallyCompliantCount = report.controls?.filter((c: any) => c.assessment_result?.status === 'partially_compliant').length || 0;
  const nonCompliantCount = report.controls?.filter((c: any) => c.assessment_result?.status === 'non_compliant').length || 0;
  const notApplicableCount = report.controls?.filter((c: any) => c.assessment_result?.status === 'not_applicable').length || 0;
  const compliancePercentage = totalControls > 0 
    ? Math.round((compliantCount / totalControls) * 100) 
    : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      color: #0B0C0E;
      margin: 0;
      padding: 0;
      background: #ffffff;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #00ADE8;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-left {
      flex: 1;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 600;
      color: #0B0C0E;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .header .subtitle {
      color: #6b7280;
      font-size: 12px;
      font-weight: 400;
    }
    .header-right {
      text-align: right;
    }
    .logo {
      color: #0B0C0E;
      font-weight: 600;
      font-size: 20px;
      font-family: 'Montserrat', sans-serif;
      letter-spacing: -0.5px;
    }
    .logo .dot {
      color: #00ADE8;
    }
    .summary {
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .summary-item {
      text-align: center;
      padding: 12px;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .summary-item .label {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 8px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .summary-item .value {
      font-size: 28px;
      font-weight: 700;
      color: #0B0C0E;
      line-height: 1;
    }
    .summary-item.compliance {
      border-left: 4px solid #00ADE8;
    }
    .summary-item.compliance .value {
      color: #00ADE8;
    }
    .compliance-stats {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .compliance-stat {
      text-align: center;
    }
    .compliance-stat .label {
      font-size: 9px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .compliance-stat .value {
      font-size: 16px;
      font-weight: 600;
    }
    .compliance-stat.compliant .value { color: #10b981; }
    .compliance-stat.partial .value { color: #f59e0b; }
    .compliance-stat.non-compliant .value { color: #ef4444; }
    .compliance-stat.not-applicable .value { color: #6b7280; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      page-break-inside: avoid;
    }
    th {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      padding: 10px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 9px;
      text-transform: uppercase;
      color: #374151;
      border: 1px solid #d1d5db;
      letter-spacing: 0.5px;
    }
    td {
      padding: 8px;
      border: 1px solid #e5e7eb;
      font-size: 10px;
      vertical-align: top;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    tr:hover {
      background: #f3f4f6;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 9px;
      text-transform: uppercase;
    }
    .status-compliant {
      background: #d1fae5;
      color: #065f46;
    }
    .status-partial {
      background: #fef3c7;
      color: #92400e;
    }
    .status-non-compliant {
      background: #fee2e2;
      color: #991b1b;
    }
    .status-not-applicable {
      background: #f3f4f6;
      color: #374151;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 9px;
      page-break-inside: avoid;
    }
    @media print {
      body {
        padding: 0;
      }
      .summary {
        page-break-inside: avoid;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>Relatório de Conformidade</h1>
      <div class="subtitle">${frameworkName} | Gerado em ${today}</div>
    </div>
    <div class="header-right">
      <div class="logo">ness<span class="dot">.</span></div>
      <div style="font-size: 9px; color: #6b7280; margin-top: 4px;">OT GRC</div>
    </div>
  </div>
  
  <div class="summary">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="label">Total de Controles</div>
        <div class="value">${totalControls}</div>
      </div>
      <div class="summary-item">
        <div class="label">Avaliações</div>
        <div class="value">${report.summary?.total_assessments || 0}</div>
      </div>
      <div class="summary-item">
        <div class="label">Evidências</div>
        <div class="value">${report.summary?.total_evidence_packages || 0}</div>
      </div>
      <div class="summary-item compliance">
        <div class="label">Conformidade</div>
        <div class="value">${compliancePercentage}%</div>
      </div>
    </div>
    
    <div class="compliance-stats">
      <div class="compliance-stat compliant">
        <div class="label">Conforme</div>
        <div class="value">${compliantCount}</div>
      </div>
      <div class="compliance-stat partial">
        <div class="label">Parcial</div>
        <div class="value">${partiallyCompliantCount}</div>
      </div>
      <div class="compliance-stat non-compliant">
        <div class="label">Não Conforme</div>
        <div class="value">${nonCompliantCount}</div>
      </div>
      <div class="compliance-stat not-applicable">
        <div class="label">Não Aplicável</div>
        <div class="value">${notApplicableCount}</div>
      </div>
    </div>
    
    <!-- Gráfico de Barras de Conformidade -->
    <div class="chart-container" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; letter-spacing: 0.5px;">
        Distribuição de Conformidade
      </div>
      <div style="display: flex; align-items: flex-end; gap: 8px; height: 120px;">
        ${(function() {
          const maxValue = Math.max(compliantCount, partiallyCompliantCount, nonCompliantCount, notApplicableCount, 1);
          const barHeight = function(value: number) { return (value / maxValue) * 100; };
          
          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%; background: linear-gradient(to top, #10b981 0%, #34d399 100%); height: ${barHeight(compliantCount)}%; border-radius: 4px 4px 0 0; margin-bottom: 8px; min-height: ${compliantCount > 0 ? '4px' : '0'};"></div>
              <div style="font-size: 9px; font-weight: 600; color: #0B0C0E;">${compliantCount}</div>
              <div style="font-size: 8px; color: #6b7280; margin-top: 4px; text-align: center;">Conforme</div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%; background: linear-gradient(to top, #f59e0b 0%, #fbbf24 100%); height: ${barHeight(partiallyCompliantCount)}%; border-radius: 4px 4px 0 0; margin-bottom: 8px; min-height: ${partiallyCompliantCount > 0 ? '4px' : '0'};"></div>
              <div style="font-size: 9px; font-weight: 600; color: #0B0C0E;">${partiallyCompliantCount}</div>
              <div style="font-size: 8px; color: #6b7280; margin-top: 4px; text-align: center;">Parcial</div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%; background: linear-gradient(to top, #ef4444 0%, #f87171 100%); height: ${barHeight(nonCompliantCount)}%; border-radius: 4px 4px 0 0; margin-bottom: 8px; min-height: ${nonCompliantCount > 0 ? '4px' : '0'};"></div>
              <div style="font-size: 9px; font-weight: 600; color: #0B0C0E;">${nonCompliantCount}</div>
              <div style="font-size: 8px; color: #6b7280; margin-top: 4px; text-align: center;">Não Conforme</div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%; background: linear-gradient(to top, #6b7280 0%, #9ca3af 100%); height: ${barHeight(notApplicableCount)}%; border-radius: 4px 4px 0 0; margin-bottom: 8px; min-height: ${notApplicableCount > 0 ? '4px' : '0'};"></div>
              <div style="font-size: 9px; font-weight: 600; color: #0B0C0E;">${notApplicableCount}</div>
              <div style="font-size: 8px; color: #6b7280; margin-top: 4px; text-align: center;">N/A</div>
            </div>
          `;
        })()}
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
    <div class="logo" style="font-size: 16px;">ness<span class="dot">.</span></div>
    <div style="margin-top: 8px;">Relatório gerado automaticamente pelo sistema ness. OT GRC</div>
    <div style="margin-top: 4px; font-size: 8px;">Sistema de Gestão de Risco e Conformidade Operacional</div>
  </div>
</body>
</html>
  `;
}

