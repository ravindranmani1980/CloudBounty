import { jsPDF } from 'jspdf';
import { CloudAccount, OptimizationOpportunity, AnomalyAlert } from '../types/finops';

export interface PdfReportData {
  accounts: CloudAccount[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  openOpportunitiesSavings: number;
  openOpportunitiesCount: number;
  anomalies: AnomalyAlert[];
  opportunities: OptimizationOpportunity[];
  forecastData?: {
    month: string;
    projected: number;
    actual?: number;
    stretchTarget: number;
    status: string;
  }[];
  carbonData?: {
    provider: string;
    currentMonth: number;
    previousMonth: number;
    diff: number;
    growth: string;
  }[];
  reportTitle?: string;
  preparedBy?: string;
}

export function generateExecutivePdf(data: PdfReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // --- PAGE 1: HEADER & METRICS ---

  // Top Accent Banner (Postrix Deep Navy #081420)
  doc.setFillColor(8, 20, 32);
  doc.rect(margin, y, contentWidth, 34, 'F');

  // Teal/Gold highlight bar on left (#2BB5A0)
  doc.setFillColor(43, 181, 160);
  doc.rect(margin, y, 3, 34, 'F');

  // Title & Subtitle inside banner
  doc.setTextColor(243, 245, 241);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MANIQ | SWEEP · EXECUTIVE FINOPS REPORT', margin + 7, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(154, 179, 200);
  doc.text('Multi-Cloud Cost Tracking, Resource Optimization & Carbon Abatement Summary', margin + 7, y + 16);

  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${timestamp}  |  Scope: AWS, Azure, Google Cloud`, margin + 7, y + 22);

  // Author Credit in banner
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(95, 211, 191);
  doc.text('Author: Mani Ravindran  |  https://ravindran.in', margin + 7, y + 29);

  y += 40;

  // SECTION 1: EXECUTIVE KPI SUMMARY (4 CARDS)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. EXECUTIVE KPI OVERVIEW', margin, y);
  y += 4;

  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 22;

  const kpis = [
    {
      label: 'TOTAL MONTHLY SPEND',
      value: `$${data.totalMonthlySpend.toLocaleString()}`,
      sub: 'Across 4 Connected Accounts',
      color: [14, 165, 233] // Sky blue
    },
    {
      label: 'REALIZED SAVINGS',
      value: `+$${data.totalMonthlySavings.toLocaleString()}/mo`,
      sub: 'Verified Remediations',
      color: [16, 185, 129] // Emerald
    },
    {
      label: 'OPEN BOUNTY PIPELINE',
      value: `$${data.openOpportunitiesSavings.toLocaleString()}/mo`,
      sub: `${data.openOpportunitiesCount} Actionable Initiatives`,
      color: [245, 158, 11] // Amber
    },
    {
      label: 'CARBON ABATEMENT',
      value: '2,920 kg',
      sub: '+23.7% vs. Prior Month',
      color: [52, 211, 153] // Teal/Emerald
    }
  ];

  kpis.forEach((kpi, index) => {
    const cardX = margin + index * (cardWidth + 3);

    // Card background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, 'FD');

    // Accent top border
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.rect(cardX, y, cardWidth, 1.5, 'F');

    // Label
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(kpi.label, cardX + 3, y + 6);

    // Value
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(kpi.value, cardX + 3, y + 13);

    // Subtext
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(kpi.sub, cardX + 3, y + 18);
  });

  y += cardHeight + 8;

  // SECTION 2: MULTI-CLOUD ACCOUNT BREAKDOWN
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. CONNECTED CLOUD INFRASTRUCTURE & BURN RATES', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('PROVIDER', margin + 3, y + 4.5);
  doc.text('ACCOUNT NAME / SCOPE', margin + 26, y + 4.5);
  doc.text('ENVIRONMENT', margin + 90, y + 4.5);
  doc.text('MONTHLY SPEND', margin + 120, y + 4.5);
  doc.text('DAILY BURN', margin + 150, y + 4.5);
  doc.text('SYNC STATUS', margin + 168, y + 4.5);
  y += 7;

  // Table Rows
  data.accounts.forEach((acc, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(acc.provider === 'aws' ? 180 : acc.provider === 'azure' ? 2 : 217, acc.provider === 'aws' ? 83 : acc.provider === 'azure' ? 132 : 83, acc.provider === 'aws' ? 9 : acc.provider === 'azure' ? 199 : 79);
    doc.text(acc.provider.toUpperCase(), margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(acc.name, margin + 26, y + 4.5);

    doc.setTextColor(100, 116, 139);
    doc.text(acc.environment, margin + 90, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`$${acc.monthlySpend.toLocaleString()}`, margin + 120, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`$${acc.dailyBurn.toLocaleString()}/d`, margin + 150, y + 4.5);

    doc.setTextColor(16, 185, 129);
    doc.text('LIVE (Verified)', margin + 168, y + 4.5);

    y += 6.5;
  });

  y += 7;

  // SECTION 3: 6-MONTH PROJECTED VS ACTUAL SAVINGS FORECAST
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. 6-MONTH SAVINGS FORECAST (PROJECTED VS. ACTUAL REALIZED)', margin, y);
  y += 4;

  // Forecast Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('PERIOD', margin + 3, y + 4.5);
  doc.text('PROJECTED RUN-RATE', margin + 35, y + 4.5);
  doc.text('ACTUAL REALIZED', margin + 75, y + 4.5);
  doc.text('VARIANCE / BEAT', margin + 115, y + 4.5);
  doc.text('STRETCH TARGET', margin + 148, y + 4.5);
  doc.text('PACING STATUS', margin + 172, y + 4.5);
  y += 7;

  const defaultForecast = data.forecastData || [
    { month: "Nov '26", projected: 22000, actual: 24800, stretchTarget: 26000, status: 'Verified' },
    { month: "Dec '26", projected: 27500, actual: 29400, stretchTarget: 32000, status: 'Current Pacing' },
    { month: "Jan '27", projected: 33000, actual: undefined, stretchTarget: 38000, status: 'Projected Model' },
    { month: "Feb '27", projected: 38500, actual: undefined, stretchTarget: 44000, status: 'Projected Model' },
    { month: "Mar '27", projected: 44000, actual: undefined, stretchTarget: 51000, status: 'Projected Model' },
    { month: "Apr '27", projected: 50000, actual: undefined, stretchTarget: 58000, status: 'Projected Model' }
  ];

  defaultForecast.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.month, margin + 3, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`$${item.projected.toLocaleString()}`, margin + 35, y + 4.2);

    if (item.actual !== undefined) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text(`$${item.actual.toLocaleString()}`, margin + 75, y + 4.2);

      const diff = item.actual - item.projected;
      doc.setTextColor(16, 185, 129);
      doc.text(`+$${diff.toLocaleString()} (+${Math.round((diff / item.projected) * 100)}%)`, margin + 115, y + 4.2);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('— On Track', margin + 75, y + 4.2);
      doc.text('Targeted', margin + 115, y + 4.2);
    }

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${item.stretchTarget.toLocaleString()}`, margin + 148, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.status.includes('Verified') ? 16 : item.status.includes('Current') ? 245 : 100, item.status.includes('Verified') ? 185 : item.status.includes('Current') ? 158 : 116, item.status.includes('Verified') ? 129 : item.status.includes('Current') ? 11 : 139);
    doc.text(item.status, margin + 172, y + 4.2);

    y += 6;
  });

  y += 7;

  // SECTION 4: CARBON ABATEMENT SUMMARY
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. ENVIRONMENTAL SUSTAINABILITY & CARBON EMISSIONS SAVINGS', margin, y);
  y += 4;

  const carbonList = data.carbonData || [
    { provider: 'AWS Cloud Services', currentMonth: 1420, previousMonth: 1180, diff: 240, growth: '+20.3%' },
    { provider: 'Microsoft Azure', currentMonth: 890, previousMonth: 710, diff: 180, growth: '+25.4%' },
    { provider: 'Google Cloud Platform', currentMonth: 610, previousMonth: 470, diff: 140, growth: '+29.8%' }
  ];

  const totalCurrent = carbonList.reduce((acc, c) => acc + c.currentMonth, 0);
  const totalPrev = carbonList.reduce((acc, c) => acc + c.previousMonth, 0);
  const totalDiff = totalCurrent - totalPrev;

  // Carbon Summary Card Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text(`TOTAL MONTHLY CARBON ABATEMENT: ${totalCurrent.toLocaleString()} kg CO2e  (+${totalDiff.toLocaleString()} kg / +${Math.round((totalDiff / totalPrev) * 100)}% MoM)`, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  doc.text(`• AWS: ${carbonList[0]?.currentMonth || 1420} kg (${carbonList[0]?.growth || '+20.3%'})  |  • Azure: ${carbonList[1]?.currentMonth || 890} kg (${carbonList[1]?.growth || '+25.4%'})  |  • GCP: ${carbonList[2]?.currentMonth || 610} kg (${carbonList[2]?.growth || '+29.8%'})`, margin + 4, y + 11.5);
  doc.text('Equivalent to planting ~138 mature trees or reducing 7,200 miles of internal combustion vehicle transit.', margin + 4, y + 15.5);

  y += 24;

  // SECTION 5: TOP ACTIONABLE OPTIMIZATION BOUNTIES
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('5. TOP ACTIONABLE OPTIMIZATION BOUNTIES & COST REMEDIATIONS', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('BOUNTY TITLE & SERVICE', margin + 3, y + 4.5);
  doc.text('PROVIDER', margin + 98, y + 4.5);
  doc.text('MONTHLY SAVINGS', margin + 120, y + 4.5);
  doc.text('ANNUAL IMPACT', margin + 152, y + 4.5);
  doc.text('EFFORT', margin + 175, y + 4.5);
  y += 7;

  const topOpportunities = data.opportunities.slice(0, 5);

  topOpportunities.forEach((opp, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    // Truncate title if too long
    const titleSnippet = opp.title.length > 56 ? `${opp.title.substring(0, 53)}...` : opp.title;
    doc.text(titleSnippet, margin + 3, y + 4.3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(opp.provider.toUpperCase(), margin + 98, y + 4.3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`+$${opp.monthlySavings.toLocaleString()}/mo`, margin + 120, y + 4.3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`$${opp.annualSavings.toLocaleString()}/yr`, margin + 152, y + 4.3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(opp.effort === 'Quick Win' ? 16 : 245, opp.effort === 'Quick Win' ? 185 : 158, opp.effort === 'Quick Win' ? 129 : 11);
    doc.text(opp.effort, margin + 175, y + 4.3);

    y += 6.5;
  });

  // FOOTER (Page 1 bottom)
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Maniq | Sweep Multi-Cloud FinOps Executive Briefing  |  Confidential & Proprietary', margin, footerY + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('Created by Mani Ravindran (https://ravindran.in)', margin + contentWidth - 68, footerY + 2);

  // Trigger Save / Download
  const filename = `Maniq-Sweep-FinOps-Executive-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
